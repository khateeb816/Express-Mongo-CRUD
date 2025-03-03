import express from "express";
import staticRoutes from "./src/routes/staticRoutes.js"
import bodyParser from 'body-parser'
import mongoose from "mongoose";
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

(async function connectDb() {
    let db = mongoose.connect('mongodb://localhost:27017/toDoList');
    db.then(() => {
        console.log('Mongoose connected')
    })
})();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');


app.use('/', staticRoutes);

app.use('/user', authRoutes);
app.use('/user', userRoutes);
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})