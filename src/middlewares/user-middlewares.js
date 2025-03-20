function validateCreateUserReq(req, res, next) {
    if(req.body.username && req.body.email && req.body.password) {
        next();
    }
    const explanations = [];
    if(!req.body.username) {
        explanations.push('username is missing');
    }
    if(!req.body.email) {
        explanations.push('email is missing');
    }
    if(!req.body.password) {
        explanations.push('password is missing');
    }
    return res.status(400).json({
        message: 'Something fields are missing in the incoming request to be able to create a new user',
        data: {},
        success: false,
        err: new Error(`${explanations}`),
    })
}

function validateSigninReq(req, res, next) {
    if(req.body.email && req.body.password) {
        next();
    }
    const explanations = [];
    if(!req.body.email) {
        explanations.push('email is missing');
    }
    if(!req.body.password) {
        explanations.push('password is missing');
    }
    return res.status(400).json({
        message: 'Something fields are missing in the incoming request to be able to create a new user',
        data: {},
        success: false,
        err: new Error(`${explanations}`),
    })
}

module.exports = {
    validateCreateUserReq,
    validateSigninReq,
}