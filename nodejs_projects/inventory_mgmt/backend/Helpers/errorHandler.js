const apiErrorHandler = (res, error, text) => {
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
            res.status(400).send({ success: false, data: null, message: msg, model: text });
        }
    }
    else if (error.errors) {
        const msg = error.errors[0].message;
        res.status(400).send({ success: false, data: null, message: msg, model: text });
    } else {
        const msg = String(error).split(': ')[1];
        res.status(400).send({ success: false, data: null, message: msg, model: text });
    }
}

module.exports = apiErrorHandler;