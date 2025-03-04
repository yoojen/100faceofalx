const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  admin,
} = require("../Config/firebase.config");
const apiErrorHandler = require("../Helpers/errorHandler");
const { default: axios } = require("axios");

const PASSWORD_CHECK = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[a-zA-Z0-9^$*\.\[\]{}()?"!@#%&/\\,><':;|_~]+$/
const auth = getAuth();

module.exports.getUsers = async (req, res) => {
  try {
    return res.send({});
  } catch (error) {
    apiErrorHandler(res, error, "user");
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ((!email || !password) || (!PASSWORD_CHECK.test(password))) {
      return res
        .status(422)
        .send({ success: false, data: null, message: "Account not created" });
    }
    const user = await createUserWithEmailAndPassword(auth, email, password);
    const accessToken = user._tokenResponse.idToken;
    const refreshToken = user._tokenResponse.refreshToken;

    res.cookie("signin", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    })
    return res.status(201).send({
      success: true,
      data: { user: user.email, accessToken },
      message: "Account created successfully",
    });
  } catch (error) {
    apiErrorHandler(res, error, "user");
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ((!email || !password) || (!PASSWORD_CHECK.test(password))) {
      return res.status(422).json({
        message: "Email or Password is required",
      });
    }
    //first find user to to avoid
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const accessToken = userCredentials._tokenResponse.idToken;
    const refreshToken = userCredentials._tokenResponse.refreshToken;
    if (accessToken) {
      res.cookie("signin", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.status(200).send({
        success: true,
        data: { accessToken, email: userCredentials._tokenResponse.email },
        message: "User logged in successfully",
      });
    } else {
      return res.status(500).send({
        success: false,
        data: null,
        message: "Something went wrong! Try again",
      });
    }
  } catch (error) {
    apiErrorHandler(res, error, "user");
  }
};

module.exports.logoutUser = async (req, res) => {
  try {
    await signOut(auth);
    res.clearCookie("signin");
    return res.status(200).json({
      success: true,
      data: "",
      message: "User logged out successfully",
    });
  } catch (error) {
    apiErrorHandler(res, error, "users");
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(422).send({
        success: false,
        data: null,
        message: "Email is required",
      });
    }
    await sendPasswordResetEmail(auth, email);
    res.status(200).send({
      success: true,
      data: "",
      message: "Password reset email sent successfully!",
    });
  } catch (error) {
    apiErrorHandler(res, error, "user");
  }
};

module.exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await admin.auth().getUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, data: null, message: "No user found" });
    }
    await sendEmailVerification(user);
  } catch (error) {
    apiErrorHandler(res, error, "user");
  }
};

module.exports.refreshAccessToken = async (req, res) => {
  const GOOGLE_APIS_URL = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API}`
  try {
    const refreshToken = req.cookies.signin;
    const response = await axios.post(GOOGLE_APIS_URL, { grant_type: 'refresh_token', refresh_token: refreshToken }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });
    const accessToken = response.data.access_token;
    const user = decodedToken = await admin.auth().verifyIdToken(accessToken);
    return res.status(200).send({ success: true, data: { accessToken, user } })
  } catch (error) {
    apiErrorHandler(res, error, 'user');
  }
}

module.exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await admin.auth().getUserByEmail(email);

    if (user)
      return res.send({
        success: true,
        data: user,
        message: "User found successfully",
      });
    else
      return res.send({ success: false, data: null, message: "No user found" });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, data: null, message: "Failed to load user" });
  }
};
