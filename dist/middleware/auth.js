const secure = require('jsonwebtoken');

const veritoken = (req, res, next) => {
    const tokena = req.headers.authorization;
    if (!tokena) {
        return res.status(401).json({"msg": "No token , authorization denied"});
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = secure.verify(token, process.env.SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({"msg": "Token is not valid"});
    }
};

module.exports = veritoken;