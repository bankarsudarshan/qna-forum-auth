const UserRepository = require('../repositories/user-repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_PRIVATE_KEY } = require('../config/server-config');
const { StatusCodes } = require('http-status-codes');
const AppError = require("../utils/app-error");

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data) {
        try{
            const user = await this.userRepository.insertUser(data);
            return user;
        } catch(error) {
            if(error.name == "SequelizeUniqueConstraintError") {
                let explanation = [];
                error.errors.forEach((err) => {
                    explanation.push(err.message);
                });
                throw new AppError("ClientSideError", explanation, StatusCodes.CONFLICT);
            }
            if (error.name == "SequelizeValidationError") {
                let explanation = [];
                error.errors.forEach((err) => {
                    explanation.push(err.message);
                });
                throw new AppError("ClientSideError", explanation, StatusCodes.BAD_REQUEST);
            }
            throw new AppError("AppError", "cannot create a new user", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getUser(userId) {
        try {
            const user = await this.userRepository.getById(userId);
            if(!user) {
                throw new AppError("NotFoundError", "user with the x-access-token does not exist", StatusCodes.NOT_FOUND);
            }
            return user;
        } catch (error) {
            console.log(error);
            throw new AppError("AppError", "somthing went wrong while getting user", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await this.userRepository.getByEmail(email);
            return user;
        } catch (error) {
            console.log('something went wrong in user-service getUserByEmail function');
            throw new AppError();
        }
    }

    createToken(user) {
        try {
            const token = jwt.sign(user.get({plain: true}), JWT_PRIVATE_KEY, {
                expiresIn: '5h',
            });
            return token;
        } catch (error) {
            console.log(error);
            throw new AppError("AppError", "somthing went wrong while creating token", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    verifyToken(token) {
        const user = jwt.verify(token, JWT_PRIVATE_KEY);
        return user;
    }

    async isAuthentiated(token) {
        try {
            const decoded = this.verifyToken(token);
            // if the token was malformed, then verify function will throw an error

            // if the user associated with the token was deleted from the database, then also the token is invalid
            const user = await this.userRepository.getByEmail(decoded.email);
            if (!user) {
                throw new AppError("ClientSideError", "user associated with this token no longer exists", StatusCodes.NOT_FOUND);
            }
            return user.id;
        } catch (error) {
            if(error.name == "TokenExpiredError") {
                throw new AppError(error.name, [error.message, error.expiredAt], StatusCodes.OK); // sending the response as OK so that it can be recognized on the backent of qna-forum. If the response status code is UNAUTHORIZED then axios(used in qna-forum/src/api/routes/v1/auth-middleware.js) does not give access to the response object(and the associated error/message/explanation) that is sent from here
            }
            throw new AppError();
        }
    }

    async signIn(email, plainPw) {
        try {
            const user = await this.userRepository.getByEmail(email);
            if (!user) {
                throw new AppError("ClientSideError", "user not found",StatusCodes.NOT_FOUND);
            }
            const match = await bcrypt.compare(plainPw, user.password);
            if (!match) {
                throw new AppError("ClientSideError", "Incorrect password", StatusCodes.UNAUTHORIZED);
            }
            const response = await this.userRepository.updateLastLogin(email);
            console.log(response);
            return this.createToken(user);
        } catch (error) {
            throw new AppError('AppError', [error.message], StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUser(userId) {
        try {
            const user = await this.userRepository.getById(userId);
            if (!user) {
                throw new AppError("ClientSideError", "user not found", StatusCodes.NOT_FOUND);
            }
            await this.userRepository.deleteUser(userId);
            return { message: "user deleted successfully" };
        } catch (error) {
            throw new AppError("AppError", "cannot delete user", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UserService;