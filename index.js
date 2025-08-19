import express from "express";
import path from 'path';
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
const arg = process.argv;


const app = express();
const publicPath = path.resolve('public');
app.set('view engine', 'ejs');
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;
const client = new MongoClient(process.env.DATABASE_URL);


const connection = async () => {
    const coneect = await client.connect();
    return await coneect.db(dbName);
}

app.get("/", (req, res) => {
    res.render('dashboard');
});

app.get('/add-task', (req, res) => {
    res.render('add-task');
});

app.get('/update-task', (req, res) => {
    res.render('update-task');
});

app.get('/delete', (req, res) => {
    res.send('Task deleted!');
});

app.post("/add", async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    console.log(result);
    
    if (result) {
        res.redirect('/');
    } else {
        res.send(`Someting went wrong!`);
    }

});

app.post("/update", (req, res) => {
    res.redirect('/');
});


app.listen(arg[2], () => {
    console.log(`Server is running on ${arg[2]}`);
})