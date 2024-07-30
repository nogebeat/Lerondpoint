

const notFound = (req, res) => {
    return res.status(404).json({ "msg": "Not found" });
};

module.exports = notFound;