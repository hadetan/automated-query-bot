const { ACCESS_TOKEN_PRIVATE_KEY } = require('../configs');
const User = require('../models/User');
const { error } = require('../utils/responseWrapper');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        const accessToken = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(accessToken, ACCESS_TOKEN_PRIVATE_KEY);
    
            req._id = decoded._id;
    
            const user = await User.findById(req._id);
            if (!user) {
                return res.send(error(404, 'User not found'));
            }
        } catch (err) {
            return res.send(error(500, err.message));
        }
    }
    
	next();
};
