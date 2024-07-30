const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('site'));

app.use(express.json());

app.listen(3001, () => console.log('Server started on port 3000'));