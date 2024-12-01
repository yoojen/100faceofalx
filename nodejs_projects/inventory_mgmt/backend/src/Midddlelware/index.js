const { admin } = require("../Config/firebase.config");

const verifyToken = async (req, res, next) => {
    const idToken = req.cookies.signin;
    if (!idToken) {
        return res.status(403).send({ success: false, data: null, message: 'Please Login' });
    } else {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(403).send({ success: false, data: null, message: 'Unauthorized' });
        }
    }
};

module.exports = verifyToken;