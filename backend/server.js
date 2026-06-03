import express from "express";
// import bodyParser from "body-parser";
// import {join, dirname} from "path"
// import { fileURLToPath } from "url";

//set your file path
// const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000


app.use(express.json());
// app.use(bodyParser.urlencoded({extended:true}));



let todos = [
    {id:1, task: "Learn Express JSON APIs", completed: false },
    {id:2, task: "Test CRUD routes in Postman", completed: false }
];


// GET ALL TODOS
app.get("/api/todos", (req, res) => {
    //   res.sendFile(join(__dirname, "..",  "/frontend/index.html"));
    res.json(todos);


    // GET A SINGLE TODO BY ID
app.get("/api/todos/:id", (req, res) => {
    const todoId = parseInt(req.params.id); 

    //Search your database array for that specific item
    const foundTodo = todos.find(todo => todo.id === todoId); //implicit arrow fuction

    //Send it if found , or give 404 error message if doesnt exist
    if(foundTodo){
        res.json(foundTodo);
    }else {
        res.status(404).json({error: "Todo item not found"});
    }
});
})

//CREAT A TODO
app.post("/api/todos", (req, res) => {
    const newTodo = {
        id: todos.length + 1,
        task: req.body.task,   // Pulls from JSON request body
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
})

//Update
app.put("/api/todos/:id", (req, res) => {
    const todoId =  parseInt(req.params.id);
    const todo = todos.find((todo) => {
        return todo.id === todoId;  //explicitly using the return key here
    });

    if(!todo){
        return res.status(404).json({error: "Todo item not found"})
    }

    // Update the task name if the user provided a new one
    if(req.body.task !== undefined){
        todo.task = req.body.task;
    }

    //update the completed status if the user proived a new one
    if(req.body.completed !== undefined){
        todo.completed = req.body.completed;
    }

    // Send back the newly updated todo item
    res.json(todo);
})

//Delete
app.delete("/api/todos/:id", (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex((todo) => {
        return todo.id === todoId
    })

    //Error check
    if(todoIndex === -1) {
        return res.status(404).json({error: `Todo with ID ${todoId} not found`});
    }
    // Go to the slot positio and delete exactly 1 item
    todos.splice(todoIndex, 1);

    //send successful message if deleted.
    res.json({message: `Todo ${todoId} deleted successfully`});
})


//Listen to the server
app.listen(port, () => {
    console.log(`server is running on localhost:${port}`)
})


