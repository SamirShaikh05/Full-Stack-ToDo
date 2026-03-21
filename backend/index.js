import express from 'express'
import { collectionName, connection } from './dbconfig.js';
import { ObjectId } from 'mongodb';
import cors from 'cors'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit';

dotenv.config();


const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(cookieParser())



const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        msg: "Too many attempts. Try again later."
    }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        msg: "Too many requests. Slow down."
    }
});

app.use(apiLimiter);

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

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.send({
                msg: "invalid token",
                success: false
            });
        }

        req.user = decoded;
        next();
    });
}

app.post('/signup', authLimiter, async (req, res) => {
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
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            res.send({
                success: true,
                msg: "signup done",
                token
            });
        }
    );
});



app.post('/login', authLimiter, async (req, res) => {
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
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

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

app.listen(process.env.PORT || 3000);