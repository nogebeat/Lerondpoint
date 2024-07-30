const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const veritoken = require('../../middleware/auth');

const message = [
    "Internal server error",
    "Bad parameter",
    "Invalid credentials",
    "Account already exists",
    "Token of the newly registered in user",
    "Token of the newly logged in user"
];


router.post('/register', function (req, res){
        
    const { firstname, name, email, phone,password, confpass, adress, birthday, sex, rank} = req.body;

    if (!firstname || !name || !email || !phone || !password || !confpass || !adress || !birthday || !sex || !rank) {
        return res.status(400).json({ "msg": message[1] });
    }
    if (password !== confpass){
        return res.status(400).json({"msg" : "Mot de passe non correspondant"})
    }
    try {
        const checkQuery = 'SELECT COUNT(*) as count FROM user WHERE email = ?';
        db.query(checkQuery, [email], async (checkErr, checkResult) => {
            if (checkErr) {
                return res.status(500).json({ "msg": message[0]});
            }
            
            if (checkResult[0].count >= 1) {
                return res.status(409).json({ "msg": message[3]});
            }

            const hashpass = await bcrypt.hash(password, 11);
            const query = 'INSERT INTO user (firstname, name, email, phone ,password, confpass, adress, birthday, sex, rank) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(query, [firstname, name, email, phone,hashpass, confpass, adress, birthday, sex, rank], (err, result) => {
                res.status(201).json({"token": message[4]});
            });
        });
    } catch (error) {
        return res.status(500).json({ "msg":'Internal server error' });
    }
});

router.post('/login', function (req, res){
    const { email, password } = req.body;
    
    try {
        const query = 'SELECT * FROM user WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": message[0]  });
            }
            if (results.length === 0) {
                return res.status(401).json({ "msg": message[2]  });
            }
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                return res.status(401).json({ "msg": message[2]  });
            }
            
            const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: '3h' });
            res.status(202).json({token});
            // res.status(202).json({"token": message[5]});
        });
    } catch (error) {
        return res.status(500).json({ "msg":'Internal server error' });
    }
});


module.exports = router;
