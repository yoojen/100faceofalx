module.exports.apiErrorHandler = (res, error, text) => {
    if (error.original) {
        const ERR_CODE_NUM = error.original.errno;
        if (ERR_CODE_NUM == 1452) {
            res.status(400).send({ success: false, transaction: null, message: 'Referenced field is not present' });
        }
    }
    else if (error.errors) {
        const msg = error.errors[0].message;
        res.status(400).send({success: false, transaction: null, message: msg});
    }else{
        const msg = String(error).split(': ')[1];
        res.status(400).send({ success: false, transaction: null, message: msg });
    }
}

