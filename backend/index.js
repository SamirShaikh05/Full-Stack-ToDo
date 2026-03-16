import express from 'express'
import { collectionName, connection } from './dbconfig.js';
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

app.get('/', (req, res) => {
    res.send({
        message: "basic API done",
        success: true
    });
})

app.listen(3000);