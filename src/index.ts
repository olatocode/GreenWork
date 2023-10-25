/** @format */

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compress());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
})

const mongo_url = 'mongodb://localhost:27017/GreenWork';

mongoose.Promise = Promise;
mongoose.connect(mongo_url);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());