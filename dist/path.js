const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');



app.use('/', express.static(path.join(__dirname, '../src/home/')));
app.use('/login', express.static(path.join(__dirname, '../src/login/')));
app.use('/assets', express.static(path.join(__dirname, '../src/assets/')));
app.use('/register', express.static(path.join(__dirname, '../src/register/')));
app.use('/dashboard', express.static(path.join(__dirname, '../src/dashboard/home')));
app.use('/dashboard/profil', express.static(path.join(__dirname, '../src/dashboard/profil')));
app.use('/dashboard/news', express.static(path.join(__dirname, '../src/dashboard/news')));
app.use('/dashboard/addnews', express.static(path.join(__dirname, '../src/dashboard/addnews')));
app.use('/dashboard/tache', express.static(path.join(__dirname, '../src/dashboard/tache')));
app.use('/dashboard/addtache', express.static(path.join(__dirname, '../src/dashboard/addtache')));
app.use('/dashboard/edit', express.static(path.join(__dirname, '../src/dashboard/edit')));
app.use('/festichill_2024',express.static(path.join(__dirname, '../src/gallery/festichill_2024')));
app.use('/festichill_2023',express.static(path.join(__dirname, '../src/gallery/festichill_2023')));
app.use('/festichill_2022p',express.static(path.join(__dirname, '../src/gallery/festichill_2022p')));
app.use('/festichill_2022',express.static(path.join(__dirname, '../src/gallery/festichill_2022')));

module.exports = app;