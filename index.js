import express from "express";
import path from 'path';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";
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

app.get("/", async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.find().toArray();
        res.render('dashboard', { result });
    } catch (error) {
        res.send(`Something went wrong, Try again`);
    }
});

app.get('/add-task', (req, res) => {
    res.render('add-task');
});


app.post("/add", async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    if (result) {
        res.redirect('/');
    } else {
        res.send(`Someting went wrong!`);
    }

});

app.get('/update-task/:id', async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if (result) {
            res.render('update-task', { result });
        }
    } catch (error) {
        res.send(`Someting went wrong!`);
    }
});

app.post("/update/:id", async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const filter = { _id: new ObjectId(req.params.id) }
        const updatedData = { $set: { taskDate: req.body.taskDate, taskTitle: req.body.taskTitle, taskDescription: req.body.taskDescription, taskStatus: req.body.taskStatus } };
        const result = await collection.updateOne(filter, updatedData);
        if (result) {
            res.redirect('/');
        }
    } catch (error) {
        res.send(`Someting went wrong, Try again!`);
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result) {
            res.redirect('/');
        }
    } catch (error) {
        res.send(`Someting went wrong!`);
    }
});


app.listen(arg[2], () => {
    console.log(`Server is running on ${arg[2]}`);
});