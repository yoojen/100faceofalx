function apiErrorHandler(res, error, text) {
    if (error.errors) {
        const msg = error.errors[0].message;
        res.status(400).send({success: false, transaction: null, message: msg});
    }
    res.status(400).send({success: false, transaction: null, message: `Failed to pull the ${text}`});
}

module.exports = {apiErrorHandler};