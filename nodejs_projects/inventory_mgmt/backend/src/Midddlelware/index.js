const { admin } = require("../Config/firebase.config");

const verifyToken = async (req, res, next) => {
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
            console.error(error);
            return res.status(401).send({ success: false, data: null, message: 'Unauthorized' });
        }
    }
};

module.exports = verifyToken;