const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');



app.use('/', express.static(path.join(__dirname, '../src/')));
app.use('/login', express.static(path.join(__dirname, '../src/login/')));
app.use('/register', express.static(path.join(__dirname, '../src/register/')));
app.use('/festichill_2024',express.static(path.join(__dirname, '../src/gallery/festichill_2024')));
app.use('/festichill_2023',express.static(path.join(__dirname, '../src/gallery/festichill_2023')));
app.use('/festichill_2022p',express.static(path.join(__dirname, '../src/gallery/festichill_2022p')));
app.use('/festichill_2022',express.static(path.join(__dirname, '../src/gallery/festichill_2022')));

module.exports = app;