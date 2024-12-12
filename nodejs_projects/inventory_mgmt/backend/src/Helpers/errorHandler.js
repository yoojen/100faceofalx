const apiErrorHandler = (res, error, text) => {
    //firebase
    if (error.code == 'auth/invalid-credential') {
        return res.status(400).send({ success: false, data: null, message: 'Incorrect email or password', model: text });
    }
    if (error.code == 'auth/email-already-in-use') {
        return res.status(409).send({ success: false, data: null, message: 'Email already registered', model: text });
    }
    if (error.original) {
        const ERR_CODE_NUM = error.original.errno;
        if (ERR_CODE_NUM == 1452) {
            res.status(400).send({
                success: false,
                data: null,
                message: `Referenced field is not present - ${error.fields.map((field) => field)}`,
                model: text
            });
        } else {
            const msg = String(error).split(': ')[1];
            return res.status(400).send({ success: false, data: null, message: msg, model: text });
        }
    }
    else if (error.errors) {
        const msg = error.errors[0].message;
        return res.status(400).send({ success: false, data: null, message: msg, model: text });
    } else {
        const msg = String(error).split(': ')[1];
        return res.status(400).send({ success: false, data: null, message: msg, model: text });
    }
}

module.exports = apiErrorHandler;