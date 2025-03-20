const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils");
const AppError = require("../utils/app-error");

function validateCreateUserReq(req, res, next) {
    if(req.body.username && req.body.email && req.body.password) {
        next();
    } else {
        ErrorResponse.message = "incomplete information sent to create new user";
    
        const explanations = [];
        if (!req.body.username) {
            explanations.push("username is missing");
        }
        if (!req.body.email) {
            explanations.push("email is missing");
        }
        if (!req.body.password) {
            explanations.push("password is missing")
        }
    
        ErrorResponse.error = new AppError( explanations, StatusCodes.BAD_REQUEST );
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
}

function validateSignInReq(req, res, next) {
    if(req.body.email && req.body.password) {
        next();
    } else {
        ErrorResponse.message = "incomplete information sent to sign in";

        const explanations = [];
        if(!req.body.email) {
            explanations.push('email is missing');
        }
        if(!req.body.password) {
            explanations.push('password is missing');
        }

        ErrorResponse.error = new AppError( explanations, StatusCodes.BAD_REQUEST );
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
}

module.exports = {
    validateCreateUserReq,
    validateSignInReq,
}