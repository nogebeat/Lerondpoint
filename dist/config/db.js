const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error : ' + err.stack);
    return;
  }
  console.log('Connected Succed to database as ID : ' + connection.threadId);
});

module.exports = connection;