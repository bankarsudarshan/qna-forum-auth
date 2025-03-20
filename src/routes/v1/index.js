const express = require('express');
const UserController = require('../../controllers/user-controller')
const UserMiddlewares = require('../../middlewares/user-middlewares');
const router = express.Router();

router.post('/signup',
    UserMiddlewares.validateCreateUserReq,
    UserController.create);

router.post('/signin',
    UserMiddlewares.validateSigninReq,
    UserController.signIn);

module.exports = router;