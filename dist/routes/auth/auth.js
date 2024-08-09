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
    const { firstname, name, email, username, phone, password, confpass, adress, birthday, sex} = req.body;

    if (!firstname || !name || !email || !phone || !username || !password || !confpass || !adress || !birthday || !sex) {
        return res.status(400).json({ "msg": "Tous les champs sont obligatoires" });
    }
    if (password !== confpass){
        return res.status(400).json({"msg" : "Mot de passe non correspondant"});
    }
    try {
        const checkQuery = 'SELECT COUNT(*) as count FROM user WHERE email = ?';
        db.query(checkQuery, [email], async (checkErr, checkResult) => {
            if (checkErr) {
                return res.status(500).json({ "msg": "Erreur interne du serveur" });
            }
            
            if (checkResult[0].count >= 1) {
                return res.status(409).json({ "msg": "L'email existe déjà" });
            }

            const checkuser1 = 'SELECT COUNT(*) as count FROM user WHERE username = ?';
            db.query(checkuser1, [username], async (checkuser1Err, checkuser1Result) => {
                if (checkuser1Err) {
                    return res.status(500).json({ "msg": "Erreur interne du serveur" });
                }
                
                if (checkuser1Result[0].count >= 1) {
                    return res.status(409).json({ "msg": "Ce Nom d'utilisateur existe déjà" });
                }

                const checkuser2 = 'SELECT COUNT(*) as count FROM user WHERE phone = ?';
                db.query(checkuser2, [phone], async (checkuser2Err, checkuser2Result) => {
                    if (checkuser2Err) {
                        return res.status(500).json({ "msg": "Erreur interne du serveur" });
                    }
                    
                    if (checkuser2Result[0].count >= 1) {
                        return res.status(409).json({ "msg": "Ce numéro existe déjà" });
                    }

                    const hashpass = await bcrypt.hash(password, 10);
                    const query = 'INSERT INTO user (firstname, name, email, username, phone, password, confpass, adress, birthday, sex) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    db.query(query, [firstname, name, email, username, phone, hashpass, confpass, adress, birthday, sex], (err, result) => {
                        if (err) {
                            console.error('Database insertion error:', err);
                            return res.status(500).json({ msg: 'Erreur d\'insertion dans la base de données' });
                        } else {
                            const userId = result.insertId;
                            const verifiedQuery = 'INSERT INTO user_verified (user_id, username) VALUES (?, ?)';
                            db.query(verifiedQuery, [userId, username], (verifiedErr, verifiedResult) => {
                                if (verifiedErr) {
                                    console.error('Database insertion error for user_verified:', verifiedErr);
                                    return res.status(500).json({ msg: 'Erreur d\'insertion dans la table user_verified' });
                                } else {
                                    const verifiedQuery2 = 'INSERT INTO token_verified (user_id, username) VALUES (?, ?)';

                                    db.query(verifiedQuery2, [userId, username], (verifiedErr2, verifiedResult2) => {
                                        if (verifiedErr2) {
                                            console.error('Database insertion error for user_verified:', verifiedErr2);
                                            return res.status(500).json({ msg: 'Erreur d\'insertion dans la table user_verified' });
                                        } else {
                                            res.status(201).json({"token": "Utilisateur enregistré avec succès"});
                                        }

                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    } catch (error) {
        return res.status(500).json({ "msg":'Erreur interne du serveur' });
    }
});


router.post('/login', function (req, res) {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ "msg": "Identifiant et mot de passe sont requis" });
    }

    let query;
    if (!isNaN(identifier)) {
        query = 'SELECT * FROM user WHERE id = ?';
    } else if (identifier.includes('@')) {
        query = 'SELECT * FROM user WHERE email = ?';
    } else {
        query = 'SELECT * FROM user WHERE username = ?';
    }

    db.query(query, [identifier], async (err, results) => {
        if (err) {
            return res.status(500).json({ "msg": "Erreur interne du serveur" });
        }
        if (results.length === 0) {
            return res.status(401).json({ "msg": "Identifiant ou mot de passe incorrect" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ "msg": "Identifiant ou mot de passe incorrect" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: '3h' });
        res.status(202).json({message: Vous êtes connecté});

        const userId = user.id;
        const inserttoken = 'UPDATE token_verified SET user_token = ? WHERE id = ?';

        db.query(inserttoken, [token, userId], (verifiedErr, verifiedResult) => {
            if (verifiedErr) {
                console.error('Database insertion error for user_verified:', verifiedErr);
                return res.status(500).json({ msg: 'Erreur d\'insertion dans la table user_verified' });
            }
        });
    });
});

router.get('/dashboard', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ "msg": "Token requis" });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ "msg": "Token invalide" });
        }

        res.status(200).json({ "msg": "Accès autorisé au tableau de bord", "userId": decoded.userId });
    });
});

router.get('/validate-token', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(400).json({ valid: false, msg: "Token requis" });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, msg: "Token invalide" });
        }

        res.status(200).json({ valid: true, userId: decoded.userId });
    });
});

module.exports = router;
