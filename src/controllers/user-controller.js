const UserService = require('../services/user-service');

const userService = new UserService();

const create = async (req, res) => {
    try{
        const response = await userService.createUser({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        return res.status(201).json({
            success: true,
            messge: 'Successfully created a new user',
            data: response,
            err: {},
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success: false,
            err: error,
        });
    }
}

const signIn = async (req, res) => {
    try{
        const response = await userService.signIn(req.body.email, req.body.password);
        return res.status(201).json({
            success: true,
            messge: 'Successfully signed in',
            data: response,
            err: {},
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success: false,
            err: error,
        });
    }
}

async function isAuthenticated(req, res) {
    try {
        // fetch the jwt token from headers
        const token = req.headers['x-access-token'];
        const response = await userService.isAuthentiated(token);
        return res.status(200).json({
            success: true,
            err: {},
            data: response,
            message: 'User is authenticated and token is valid',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success: false,
            err: error,
        });
    }
}

module.exports = {
    create,
    signIn,
    isAuthenticated,
}