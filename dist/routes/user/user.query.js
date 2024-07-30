const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const veritoken = require('../../middleware/auth');

const message = [
    "Internal server error",
    "Bad parameter",
    "Successfully deleted record number : "
];

router.get('/users/:identifier', veritoken, function (req, res) {
    const identifier = req.params.identifier;
    let query;
    if (!isNaN(identifier)) {
        query = 'SELECT * FROM user WHERE id = ?';
    } else {
        query = 'SELECT * FROM user WHERE email = ?';
    }
    db.query(query, [identifier], (err, results) => {
        if (err) {
            return res.status(500).json({ "msg": message[0] });
        }
        if (results.length === 0) {
            return res.status(404).json({ "msg": message[1] });
        }
        const user = results[0];
        res.status(200).json(user);
    });
});

router.delete('/users/:id', veritoken, function (req, res) {
    const userId = req.params.id;

    const query = 'SELECT * FROM user WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({"msg": message[0] });
        }
        if (results.length === 0) {
            return res.status(404).json({"msg": message[1] });
        }
        const queryDelete = 'DELETE FROM user WHERE id = ?';
        db.query(queryDelete, [userId], (err, deleteResult) => {
            if (err) {
                return res.status(500).json({"msg": message[0] });
            }
            return res.status(200).json({ "msg": message[2] + userId });
        });
    });
});

router.put('/users/:id', veritoken, function (req, res) {
    const userid = req.params.id;

    
    const {firstname, name, email, password, confpass, adress, birthday, sex, rank} = req.body;

    if (!firstname || !name || !email || !password || !confpass || !adress || !birthday || !sex || !rank) {
        return res.status(400).json({ "msg": message[1] });
    }
    
    bcrypt.hash(password, 11, function (err, hashpass) {
        if (err) {
            return res.status(500).json({ "msg": message[0] });
        }
    
        const querySelect = 'SELECT * FROM user WHERE id = ?';
        db.query(querySelect, [userid], (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": message[0] });
            }
            if (results.length === 0) {
                return res.status(404).json({"msg": message[1] });
            }


            const queryUpdate = 'UPDATE user SET firstname = ?, name = ?, email = ?, phone = ?, password = ?, confpass = ?, adress = ?, birthday = ?, sex = ?, rank = ? WHERE id = ?';
            db.query(queryUpdate, [firstname, name, email, hashpass, confpass, adress, birthday, sex, rank], (err, updateResult) => {
                if (err) {
                    return res.status(404).json({"msg": message[1] });
                }
                const query = 'SELECT * FROM user WHERE id = ?';
                    db.query(query, [userid], (err, results) => {
                    if (err) {
                        return res.status(500).json({"msg": message[0] });
                    }
                    if (results.length === 0) {
                        return res.status(404).json({"msg": message[1] });
                    }
                    const user = results[0];
                    res.status(200).json(user);
                });
            });
        });
    });
});

module.exports = router;
