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

const client = new MongoClient(process.env.DATABASE_URL || process.env.OBTAINER_URL || 'mongodb')

const connection = async () => {
    try {
        const connect = await client.connect();
        return connect.db(dbName);
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

app.get("/", async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.find().toArray();
        res.render('dashboard', { result });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.send(`Something went wrong, Try again`);
    }
});

app.get('/add-task', (req, res) => {
    res.render('add-task');
});

app.post("/add", async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(req.body);
        if (result) {
            res.redirect('/');
        } else {
            res.send(`Something went wrong!`);
        }
    } catch (error) {
        console.error('Error adding task:', error);
        res.send(`Something went wrong!`);
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
        console.error('Error fetching task for update:', error);
        res.send(`Something went wrong!`);
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
        console.error('Error updating task:', error);
        res.send(`Something went wrong, Try again!`);
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
        console.error('Error deleting task:', error);
        res.send(`Something went wrong!`);
    }
});

app.post("/delete-multiple", async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const ids = [].concat(req.body.selectedTasks || []);
        const selectedItems = ids.map(id => new ObjectId(id));
        const result = await collection.deleteMany({_id:{$in:selectedItems}});
        if (result) {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error deleting multiple tasks:', error);
        res.send(`Something went wrong, Try again`);
    }
});

const port = process.env.PORT || arg[2] || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});