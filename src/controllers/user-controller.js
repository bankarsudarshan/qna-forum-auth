const UserService = require('../services/user-service');
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils");
const AppError = require("../utils/app-error");

const userService = new UserService();

const create = async (req, res) => {
    try{
        const response = await userService.createUser({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        SuccessResponse.message = 'successfully created a new user';
        SuccessResponse.data = response;

        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

const signIn = async (req, res) => {
    try{
        const response = await userService.signIn(req.body.email, req.body.password);
        SuccessResponse.message = 'user sign in successful';
        SuccessResponse.data = response;

        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function isAuthenticated(req, res) {
    try {
        // fetch the jwt token from headers
        const token = req.headers['x-access-token'];
        const response = await userService.isAuthentiated(token);
        SuccessResponse.message = 'user is authenticated and token is valid';
        SuccessResponse.data = response;

        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    create,
    signIn,
    isAuthenticated,
}