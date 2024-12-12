const { admin } = require("../Config/firebase.config");

const NO_ACCESS_TOKEN = ['/users/auth/register', '/users/auth/login', '/users/auth/refresh', '/users/auth/reset-psd']

const verifyToken = async (req, res, next) => {
    const requestedURL = req.originalUrl;
    if (!NO_ACCESS_TOKEN.includes(requestedURL)) {
        let accessToken = req.headers['authorization'];
        accessToken = accessToken.split(' ')[1];
        if (!accessToken) {
            return res.status(403).send({ success: false, data: null, message: 'Please Login' });
        } else {
            try {
                const decodedToken = await admin.auth().verifyIdToken(accessToken.trim());
                req.user = decodedToken;
                next();
            } catch (error) {
                return res.status(401).send({ success: false, data: null, message: 'Unauthorized' });
            }
        }
    } else {
        next();
    }
};

module.exports = verifyToken;