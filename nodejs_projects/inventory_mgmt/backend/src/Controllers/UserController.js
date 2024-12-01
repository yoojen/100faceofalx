const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    admin
} = require('../Config/firebase.config');
const models = require('../Models/models');
const apiErrorHandler = require('../Helpers/errorHandler');


const auth = getAuth();

module.exports.getUsers = async (req, res) => {
    try {
        return res.send({});
    } catch (error) {
        apiErrorHandler(res, error, 'user');
    }
}

module.exports.createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).send({ success: false, data: null, message: 'Account not created' });
        }
        const user = await createUserWithEmailAndPassword(auth, email, password)
        return res.status(201).send({success: true, data: user, message: 'Account created successfully'})
    } catch (error) {
        apiErrorHandler(res, error, 'user');
    }
}


module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = userCredentials._tokenResponse.idToken;
        if (idToken) {
            res.cookie('signin', idToken, { httpOnly: true });
            return res.status(200).send({ success: true, data: userCredentials, message: 'User logged in successfully' });
        } else {
            return res.status(500).send({ success: false, data: null, message: 'Something went wrong! Try again' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'user')   
    }
}

module.exports.logoutUser = async (req, res) => {
    try {
        await signOut(auth)
        res.clearCookie('signin')
        return res.status(200).json({ success: true, data: '', message: "User logged out successfully" });
    } catch (error) {
        apiErrorHandler(res, error, 'users');
    }
}

module.exports.resetPassword = async (req, res)=> {
    
    try {
        const { email } = req.body;
        await sendPasswordResetEmail(auth, email);
        if (!email ) {
            return res.status(422).send({
                success: false, data: null, message: "Email is required"
            });
        }
        res.status(200).send({
            success: true, data: '', message: "Password reset email sent successfully!"
        });
    } catch (error) {
        apiErrorHandler(res, error, 'user');
    }
}

module.exports.verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await admin.auth().getUserByEmail(email);
        if (!user) {
            return res.status(404).send({ success: false, data: null, message: 'No user found' });
        }
        await sendEmailVerification(user);
    } catch (error) {
        apiErrorHandler(res, error, 'user');
    }
}

module.exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await admin.auth().getUserByEmail(email);
        
        if (user) return res.send({ success: true, data: user, message: 'User found successfully' });
        else return res.send({ success: false, data: null, message: 'No user found' });
    } catch (error) {
       return res.status(400).send({ success: false, data: null, message: 'Failed to load user' });
    }
}
