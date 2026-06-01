import express from "express";
import bodyParser from "body-parser";
import path, {dirname} from "path"
import { fileURLToPath } from "url";

//set your file path
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000


app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))

 

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "frontend", "index.html"));
})

app.post("/submit", (req, res) => {
    res.send(req.body);
    console.log(req.body);
})






//Update
app.put("/user/angela", (req, res) => {
    res.sendStatus(200);
})

// Update partically
app.patch("/user/angela", (req, res) => {
    res.sendStatus(200);
})

//Delete
app.delete("/user/angela", (req, res) => {
    res.sendStatus(200);
})


//Listen to the server
app.listen(port, () => {
    console.log(`server is running on localhost:${port}`)
})


