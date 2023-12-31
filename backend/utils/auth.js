const jwt = require('jsonwebtoken');

function generateToken(userInfo) {
    if (!userInfo) {
        return null;
    }

    return jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
}

function verifyToken(username, token) {
    try {
        const response = jwt.verify(token, process.env.JWT_SECRET);
        
        if (response.username !== username) {
            return {
                verified: false,
                message: 'invalid user'
            }
        }

        return {
            verified: true,
            message: 'verified'
        };
    } catch (error) {
        return {
            verified: false,
            message: 'invalid token'
        };
    }
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;