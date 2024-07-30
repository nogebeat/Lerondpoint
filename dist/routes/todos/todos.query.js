const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const veritoken = require('../../middleware/auth');

const message = [
    "Internal server error",
    "Bad parameter",
    "Successfully deleted record number : ",
    "Account already exists",
    "Successfully deleted record number : "
];

router.get('/todos/:id', veritoken, function (req, res) {
    const todoId = req.params.id;
    const query = 'SELECT * FROM todo WHERE id = ?';
    db.query(query, [todoId], (err, results) => {
        if (err) {
            return res.status(500).json({ "msg": message[0]  });
        }
        if (results.length === 0) {
            return res.status(404).json({ "msg": message[1]  });
        }
        const user = results[0];
        res.status(200).json(user);
    });
});

router.delete('/todos/:id', veritoken, function (req, res) {
    const todoId = req.params.id;

    const query = 'SELECT * FROM todo WHERE id = ?';
    db.query(query, [todoId], (err, results) => {
        if (err) {
            return res.status(500).json({ "msg": message[0]  });
        }
        if (results.length === 0) {
            return res.status(404).json({ "msg": message[1]  });
        }
        const queryDelete = 'DELETE FROM todo WHERE id = ?';
        db.query(queryDelete, [todoId], (err, deleteResult) => {
            if (err) {
                return res.status(500).json({ "msg": message[0]  });
            }
            return res.status(200).json({ "msg": message[4] + todoId });
        });
    });
});


router.put('/todos/:id', veritoken, function (req, res) {
    const todoId = req.params.id;
    const {title, description, due_time, user_id, status} = req.body;

    
    const querySelect = 'SELECT * FROM todo WHERE id = ?';
    db.query(querySelect, [todoId], (err, results) => {
        if (err) {
            return res.status(500).json({ "msg": message[0] });
        }
        if (results.length === 0) {
            return res.status(404).json({ "msg": message[1]  });
        }

        const queryUpdate = 'UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?';
        db.query(queryUpdate, [title, description, due_time, user_id, status, todoId], (err, updateResult) => {
            if (err) {
                return res.status(404).json({ "msg": message[1]  });
            }
            const query = 'SELECT * FROM todo WHERE id = ?';
        db.query(query, [todoId], (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": message[0]  });
            }
            if (results.length === 0) {
                return res.status(404).json({ "msg": message[1]  });
            }
            const user = results[0];
            res.status(200).json(user);
        });
        });
    });
});

module.exports = router;
