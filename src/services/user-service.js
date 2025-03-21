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
                throw new AppError(explanation, StatusCodes.CONFLICT);
            }
            if (error.name == "SequelizeValidationError") {
                let explanation = [];
                error.errors.forEach((err) => {
                    explanation.push(err.message);
                });
                throw new AppError(explanation, StatusCodes.BAD_REQUEST);
            }
            throw new AppError("cannot create a new user", StatusCodes.INTERNAL_SERVER_ERROR);
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
            throw new AppError("somthing went wrong while creating token", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    verifyToken(token) {
        try {
            const user = jwt.verify(token, JWT_PRIVATE_KEY);
            return user;
        } catch (error) {
            throw new AppError("invalid or expired token", StatusCodes.UNAUTHORIZED);
        }
    }

    async isAuthentiated(token) {
        try {
            const decoded = this.verifyToken(token);
            // if the token was malformed, then verify function will throw an error

            // if the user associated with the token was deleted from the database, then also the token is invalid
            const user = await this.userRepository.getByEmail(decoded.email);
            if (!user) {
                throw new AppError("user associated with this token no longer exists", StatusCodes.UNAUTHORIZED);
            }
            return user.id;
        } catch (error) {
            throw new AppError("authentication failed", StatusCodes.UNAUTHORIZED);
        }
    }

    async signIn(email, plainPw) {
        try {
            const user = await this.userRepository.getByEmail(email);
            if (!user) {
                throw new AppError("user not found",StatusCodes.NOT_FOUND);
            }
            console.log('hi2');
            const match = await bcrypt.compare(plainPw, user.password);
            if (!match) {
                throw new AppError("Incorrect password", StatusCodes.UNAUTHORIZED);
            }
            const response = await this.userRepository.updateLastLogin(email);
            console.log(response);
            return this.createToken(user);
        } catch (error) {
            throw new AppError("sign-in failed",StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUser(userId) {
        try {
            const user = await this.userRepository.getById(userId);
            if (!user) {
                throw new AppError("user not found", StatusCodes.NOT_FOUND);
            }
            await this.userRepository.deleteUser(userId);
            return { message: "user deleted successfully" };
        } catch (error) {
            throw new AppError("cannot delete user", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UserService;