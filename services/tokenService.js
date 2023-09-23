const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const generateToken = ({ _id, username }) => {
    const payload = {
        id: _id,
        username
    };

    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

module.exports = generateToken;