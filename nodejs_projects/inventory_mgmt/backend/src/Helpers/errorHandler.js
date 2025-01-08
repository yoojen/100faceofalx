const apiErrorHandler = (res, error, text) => {
    //firebase
    if (error.code == 'auth/invalid-credential') {
        return res.status(400).send({ success: false, error: 'Incorrect email or password', model: text });
    }
    if (error.code == 'auth/email-already-in-use') {
        return res.status(409).send({ success: false, error: 'Email already registered', model: text });
    }
    if (error.original) {

        const ERR_CODE_NUM = error.original.errno;
        if (ERR_CODE_NUM == 1452) {
            res.status(400).send({
                success: false,
                data: null,
                error: `Check this input - \"${error.fields.map((field) => field)}\"`,
                model: text
            });
        } else {
            console.log(error)

            const msg = String(error).split(': ')[1];
            return res.status(400).send({ success: false, error: 'Something went wrong', model: text });
        }
    }
    else {
        return res.status(400).send({ success: false, error: 'Something went wrong', model: text });
    }
    console.log(error)
}

module.exports = apiErrorHandler;