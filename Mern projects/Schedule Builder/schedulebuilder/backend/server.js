const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection has been established!');
});

const scheduleBuilderRoute = require('./routes/scheduleBuilder');
const scheduleRoute = require('../backend/routes/schedule');

app.use('/scheduleBuilder', scheduleBuilderRoute);
app.use('/schedule', scheduleRoute);

app.listen(port, () => {
    console.log(`Port has been opened: ${port}`);
});