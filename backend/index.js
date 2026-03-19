import express from 'express'
import { collectionName, connection } from './dbconfig.js';
import { ObjectId } from 'mongodb';
import cors from 'cors'


const app = express();

app.use(express.json());
app.use(cors())

app.post('/add-task', async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    if (result) {
        res.send({
            message: "task added",
            success: true,
            result
        });
    }
    else {
        res.send({
            message: "basic not added",
            success: false
        });
    }
})

app.get('/tasks', async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.find().toArray();
    if (result) {
        res.send({
            message: "task list fetched",
            success: true,
            result
        });
    }
    else {
        res.send({
            message: "error: can't fetch data",
            success: false
        });
    }
})

app.delete('/delete/:id', async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({
        _id: new ObjectId(req.params.id)
    });
    if (result.deletedCount > 0) {
        res.send({
            message: "task deleted",
            success: true
        });
    }
    else {
        res.send({
            message: "error: task not found",
            success: false
        });
    }
})

app.delete('/delete-many', async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    let ids = req.body;
    const result = await collection.deleteMany({
        _id: {$in: ids.map(id=>new ObjectId(id))}
    });
    if (result.deletedCount > 0) {
        res.send({
            message: "tasks deleted",
            success: true
        });
    }
    else {
        res.send({
            message: "error: tasks not found",
            success: false
        });
    }
})

app.put('/update/:id', async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
            $set: {
                title: req.body.title,
                description: req.body.description
            }
        }
    );
    if (result) {
        res.send({
            message: "task updated",
            success: true
        });
    }
    else {
        res.send({
            message: "error: task cant updated",
            success: false
        });
    }
})

app.get('/', (req, res) => {
    res.send({
        message: "basic API done",
        success: true
    });
})

app.listen(3000);