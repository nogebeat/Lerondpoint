const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const veritoken = require('../../middleware/auth');

const message = [
    "Internal server error",
    "Bad parameter",
    "Successfully deleted record number : ",
    "Not found"
];

router.get('/user', veritoken, function (req, res) {
    const userId = req.userId;
    const query = 'SELECT * FROM user';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ "msg": message[0]  });
        }
        if (results.length === 0) {
            return res.status(404).json({ "msg": message[3]  });
        }
        res.status(200).json(results);
    });
});

router.get('/user/todos', veritoken, function (req, res) {

    const query = 'SELECT DISTINCT u.* FROM user u INNER JOIN todo t ON u.id = t.user_id';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ "msg": message[0] });
        }
        if (results.length === 0) {
            return res.status(404).json({ "msg": message[3] });
        }
        res.status(200).json(results);
    });
});

module.exports = router;