import 'dotenv/config';
import express from "express";
import cors from "cors";
import pool from "./db.js"


const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;



// GET ALL TODOS
app.get("/api/todos", async (req, res) => {
    try{
        const allTodos = await pool.query("SELECT * FROM todos ORDER BY id ASC");
        res.status(200).json(allTodos.rows);
    }catch (error) {
        console.error(error.message)
        res.status(500).send({message: "Server Error"});
    } 
})



    // GET A SINGLE TODO BY ID
app.get("/api/todos/:id", async (req, res) => {
    try {
        const todoId = parseInt(req.params.id); 
        const getTodo = await pool.query("SELECT * FROM todos WHERE id = $1", [todoId]); 

// VALIDATE EXISTENCE (Check the rows array inside getTodo)
    if (getTodo.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }
// RESPOND (Send back the item found at index 0)
    res.status(200).json(getTodo.rows[0]);
    }catch (error) {
       console.error(error.message);
       res.status(500).json({ message: "Server error" });
  }
});



//CREAT A TODO
app.post("/api/todos", async (req, res) => { 
   try {
       const { task, completed } = req.body;
    //  VALIDATE If field is empty 
    if (task === "") {
       return res.status(400).json({ message: "Task cannot be empty" }); 
    }
       const newTodo = await pool.query("INSERT INTO todos (task, completed) VALUES ($1, $2) RETURNING *", [task, completed]);
       return res.status(201).json(newTodo.rows[0]);
    }catch (error) {
       console.error(error.message); 
       res.status(500).json({ message: "Server Error" });
  }
});



//Update Todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { task } = req.body; 
    // VALIDATE INPUT: Check right here BEFORE calling the database.
    if (!task) {
        return res.status(400).json({ message: "Task cannot be empty." });
    }
    // EXECUTE: Safe to update now
        const updateTodo = await pool.query("UPDATE todos SET task = $1 WHERE id = $2 RETURNING *",[task, id]);
    //  VALIDATE EXISTENCE: Did ID actually exist?
    
    if (updateTodo.rows.length === 0) {
        return res.status(404).json({ message: "Todo not found!" });
    }
    //  RESPOND: Success messsage to user
       res.status(200).json({ message: "Todo was updated!" });
     }catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
  }
});


//Delete
app.delete('/api/todos/:id', async (req, res) => {
  try {
      const { id } = req.params;
    // EXECUTE: Ask Postgres to delete it and return what it deleted
      const deleteTodo = await pool.query("DELETE FROM todos WHERE id = $1 RETURNING *", [id]);

    // VALIDATE: Check if that ID exists and if not, server stops there
    if (deleteTodo.rows.length === 0) {
        return res.status(404).json({ message: "Todo not found." });
    }

    // RESPOND: It existed, it's deleted, send success message
       res.status(200).json({ message: "Todo was successfully deleted!" });
    }catch (error) {
       console.error(error.message);
       res.status(500).json({ error: "Server error" });
  }
});


//Listen to the server
app.listen(port, () => {
    console.log(`server is running on port:${port}`)
})


