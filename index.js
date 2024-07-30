const express = require('express');
const fs = require('fs');
const app = express();
const db = require('./dist/config/db');
require('dotenv').config();
const path = require('path');

const notFound = require('./dist/middleware/notFound');

const authroutes = require('./dist/routes/auth/auth');
const todoroutes = require('./dist/routes/todos/todos');
const todoqueryroutes = require('./dist/routes/todos/todos.query');
const userroutes = require('./dist/routes/user/user');
const userqueryroutes = require('./dist/routes/user/user.query');

const site = require('./dist/path')

app.use(express.json());

app.use('/auth', authroutes);
app.use('/user', userroutes);
app.use('/user', userqueryroutes);
app.use('/todos', todoroutes);
app.use('/todos', todoqueryroutes);
app.use('/', site);


app.use(authroutes);
app.use(userroutes);
app.use(userqueryroutes);
app.use(todoroutes);
app.use(todoqueryroutes);

app.use(notFound);

app.listen(process.env.PORT, () => {
  console.log(`Le Serveur tourne sur port : ${process.env.PORT}`);
});
