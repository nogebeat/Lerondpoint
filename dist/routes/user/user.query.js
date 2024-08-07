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
    } else if (identifier.includes('@')) {
        query = 'SELECT * FROM user WHERE email = ?';
    } else {
        query = 'SELECT * FROM user WHERE username = ?';
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
    const identifier = req.params.id;

    let query;
    let querySelect;
    let queryUpdate;
    let verifiedQuery;
    let verifiedQuery2;

    if (!isNaN(identifier)) {
        querySelect = 'SELECT * FROM user WHERE id = ?';
        query = 'SELECT * FROM user WHERE id = ?';
        queryUpdate = 'UPDATE user SET firstname = ?, name = ?, email = ?, username = ?, phone = ?, password = ?, confpass = ?, adress = ?, birthday = ?, sex = ? WHERE id = ?';
        verifiedQuery = 'UPDATE user_verified SET username = ? WHERE id = ?';
        verifiedQuery2 = 'UPDATE token_verified SET username = ? WHERE id = ?';
    } else if (identifier.includes('@')) {
        querySelect = 'SELECT * FROM user WHERE email = ?';
        query = 'SELECT * FROM user WHERE email = ?';
        queryUpdate = 'UPDATE user SET firstname = ?, name = ?, email = ?, username = ?, phone = ?, password = ?, confpass = ?, adress = ?, birthday = ?, sex = ?, WHERE email = ?';
        verifiedQuery = 'UPDATE user_verified SET username = ? WHERE email = ?';
        verifiedQuery2 = 'UPDATE token_verified SET username = ? WHERE email = ?';
    } else {
        querySelect = 'SELECT * FROM user WHERE username = ?';
        query = 'SELECT * FROM user WHERE username = ?';
        queryUpdate = 'UPDATE user SET firstname = ?, name = ?, email = ?, username = ?, phone = ?, password = ?, confpass = ?, adress = ?, birthday = ?, sex = ? WHERE username = ?';
        verifiedQuery = 'UPDATE user_verified SET username = ? WHERE username = ?';
        verifiedQuery2 = 'UPDATE token_verified SET username = ? WHERE username = ?';
    }

    const {firstname, name, email, username, phone, password, confpass, adress, birthday, sex} = req.body;


    if (!firstname || !name || !email || !phone || !username || !password || !confpass || !adress || !birthday || !sex) {
        return res.status(400).json({ "msg": message[1] });
    }
    
    bcrypt.hash(password, 11, function (err, hashpass) {
        if (err) {
            return res.status(500).json({ "msg": message[0] });
        }

        db.query(querySelect, [identifier], (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": message[0] });
            }
            if (results.length === 0) {
                return res.status(401).json({"msg": message[1] });
            }


            // const queryUpdate = 'UPDATE user SET firstname = ?, name = ?, username = ?,email = ?, phone = ?, password = ?, confpass = ?, adress = ?, birthday = ?, sex = ? WHERE id = ?';
            db.query(queryUpdate, [firstname, name, email, username, phone, hashpass, confpass, adress, birthday, sex, identifier], (err, updateResult) => {
                if (err) {
                    return res.status(404).json({"msg test": err });
                }
                // const query = 'SELECT * FROM user WHERE id = ?';
                    db.query(query, [identifier], (err, results) => {
                    if (err) {
                        return res.status(500).json({"msg": message[0] });
                    }
                    if (results.length === 0) {
                        return res.status(404).json({"msg": message[1] });
                    }
                    db.query(verifiedQuery, [username, identifier], (verifiedErr, verifiedResult) => {
                        if (verifiedErr) {
                            console.error('Database insertion error for user_verified:', verifiedErr);
                            return res.status(500).json({ msg: 'Erreur d\'insertion dans la table user_verified' });
                        } else {

                            db.query(verifiedQuery2, [username, identifier], (verifiedErr2, verifiedResult2) => {
                                if (verifiedErr2) {
                                    console.error('Database insertion error for user_verified:', verifiedErr2);
                                    return res.status(500).json({ msg: 'Erreur d\'insertion dans la table user_verified' });
                                } else {
                                    res.status(201).json({"token": "Utilisateur modifié avec succès"});
                                }

                            });
                        }
                    });

                    const user = results[0];
                    res.status(200).json(user);
                });
            });
        });
    });
});

module.exports = router;
