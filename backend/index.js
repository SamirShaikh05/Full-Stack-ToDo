import express from 'express'
import { collectionName, connection } from './dbconfig.js';
import { ObjectId } from 'mongodb';
import cors from 'cors'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())

app.post('/add-task', verifyJWTToken, async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne({
        ...req.body,
        userId: req.user.userId
    });
    if (result) {
        res.send({
            message: "task added",
            success: true,
            result
        });
    }
    else {
        res.send({
            message: "task cant added",
            success: false
        });
    }
})

app.get('/tasks', verifyJWTToken, async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.find({
        userId: req.user.userId
    }).toArray();
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

app.delete('/delete/:id', verifyJWTToken, async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({
        _id: new ObjectId(req.params.id),
        userId: req.user.userId
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

app.delete('/delete-many', verifyJWTToken, async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    let ids = req.body;
    const result = await collection.deleteMany({
        _id: { $in: ids.map(id => new ObjectId(id)) },
        userId: req.user.userId
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

app.put('/update/:id', verifyJWTToken, async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(
        {
            _id: new ObjectId(req.params.id),
            userId: req.user.userId
        },
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


function verifyJWTToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.send({ success: false, msg: "No token" });
    }

    jwt.verify(token, 'Todo', (error, decoded) => {
        if (error) {
            return res.send({
                msg: "invalid token",
                success: false
            });
        }

        req.user = decoded; // 🔥 VERY IMPORTANT
        next();
    });
}

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.send({ success: false, msg: "Missing fields" });
    }

    const db = await connection();
    const collection = db.collection('user');

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
        return res.send({ success: false, msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await collection.insertOne({ name, email, password: hashedPassword });

    jwt.sign(
        { userId: response.insertedId, email },
        'Todo',
        { expiresIn: '7d' },
        (err, token) => {
            res.send({
                success: true,
                msg: "signup done",
                token
            });
        }
    );
});



app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send({ success: false, msg: "Missing fields" });
    }

    const db = await connection();
    const collection = db.collection('user');

    const user = await collection.findOne({ email });

    if (!user) {
        return res.send({
            success: false,
            msg: "User not found"
        });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
        return res.send({
            success: false,
            msg: "Wrong password"
        });
    }

    jwt.sign(
        { userId: user._id, email },
        'Todo',
        { expiresIn: '7d' },
        (err, token) => {
            res.send({
                success: true,
                msg: "login successfully",
                token
            });
        }
    );
});

app.get('/', (req, res) => {
    res.send({
        message: "basic API done",
        success: true
    });
})

app.listen(3000);