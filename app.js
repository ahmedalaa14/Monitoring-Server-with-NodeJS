require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const ServiceRoutes = require('./routes/service');
const reportingService = require('./services/reporting');

const app = express();
// Middlewares
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Authentication and Service Routes ( URLs checks , Reports) 
app.use('/auth', authRoutes);
app.use('/service', ServiceRoutes);
// Error Handling Middleware
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message , data: data });
});

// MongoDB Connection
mongoose
    .connect(
        process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(result => {
        app.listen(process.env.PORT || 8080);
    })
    .catch(err => console.log(err));
reportingService.startMonitoring();