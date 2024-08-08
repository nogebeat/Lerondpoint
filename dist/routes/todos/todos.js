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
    "Token of the newly registered in todo",
    "Not found"
];

router.get('/todos', veritoken, function (req, res) {
    const todoId = req.todoId;
    const query = 'SELECT * FROM todo';
    db.query(query, [todoId], (err, results) => {
        if (err) {
            return res.status(500).json({ "msg": message[0]  });
        }
        if (results.length === 0) {
            return res.status(404).json({ "msg": message[3] });
        }
        res.status(200).json(results);
    });
});

router.post('/todos', veritoken,function (req, res) {
    
    const { title, description, due_time, user_id, status} = req.body;
    console.log('Requête reçue: ', req.body);

    if (!title || !description || !due_time || !user_id || !status) {
        return res.status(400).json({ "msg": message[1]  });
    }

    const checkQuery = 'SELECT COUNT(*) as count FROM todo WHERE title = ?';
    db.query(checkQuery, [title], async (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking title:', checkErr);
            return res.status(500).json({ "msg": message[0]  });
        }
        
        if (checkResult[0].count > 0) {
            return res.status(409).json({ "msg": message[3]  });
        }
        const query = 'SELECT COUNT(*) as count FROM user WHERE id = ?';
        db.query(query, [user_id], (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": message[0]  });
            }
            if (results[0].count != 1) {
                return res.status(404).json({ "msg": message[1]  });
            }
            const inquery = 'INSERT INTO todo (title, description, due_time, user_id , status) VALUES (?, ?, ?, ?, ?)';
            db.query(inquery, [ title, description, due_time, user_id , status], (err, result) => {
                if (err) {
                    console.error('Error inserting todo:', err);
                    return res.status(501).json({ "msg": message[0]  });
                }
                res.status(201).json({"token": message[4]});
            });
        });
    });
});

module.exports = router;