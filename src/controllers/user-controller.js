const UserService = require('../services/user-service');
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils");

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
        if(error.statusCode == 409) {
            ErrorResponse.message = "resource already exists";
        } else if (error.statusCode == 400) {
            ErrorResponse.message = "the resource did not pass the validation criteria";
        }
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
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.message = 'error while authenticating the jsonwebtoken';
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function getUser(req, res) {
    try {
        const token = req.headers['x-access-token'];
        const decoded = userService.verifyToken(token);
        const user = await userService.getUserByEmail(decoded.email);
        SuccessResponse.message = 'user information retrieved successfully';
        SuccessResponse.data = user.dataValues;

        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = 'error while retrieving user';
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
    getUser,
}