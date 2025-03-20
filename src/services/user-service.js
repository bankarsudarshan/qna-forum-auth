const UserRepository = require('../repositories/user-repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_PRIVATE_KEY } = require('../config/server-config');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data) {
        try{
            const user = await this.userRepository.insertUser(data);
            return response;
        } catch(error) {
            console.log('something went wrong in the service layer');
            throw error;
        }
    }

    createToken(user) {
        try {
            const token = jwt.sign(user, JWT_PRIVATE_KEY, {
                expiresIn: '5h',
            });
            return token;
        } catch (error) {
            console.log('something went wrong in the service layer');
            throw error;
        }
    }

    verifyToken(token) {
        try {
            const user = jwt.verify(token, JWT_PRIVATE_KEY);
            return user;
        } catch (error) {
            console.log('something went wrong in the service layer');
            throw error;
        }
    }

    // async checkPassword(encryptedPw, plainPw) {;
    //     const match = await bcrypt.compare(encryptedPw, plainPw);
    //     return match;
    // }

    async isAuthentiated(token) {
        try {
            const decoded = this.verifyToken(token);
            // if the token was malformed, then verify function will throw an error

            // if the user associated with the token was deleted from the database, then also the token is invalid
            const user = await this.userRepository.getByEmail(email);
            if (!user) {
                throw { error: 'User not found' };
            }
            return user.id;
        } catch (error) {
            console.log('something went wrong in the service layer');
            throw error;
        }
    }

    async signIn(email, plainPw) {
        try {
            const user = await this.userRepository.getByEmail(email);
            if (!user) {
                throw { error: 'User not found' };
            }
            const match = await bcrypt.compare(plainPw, user.password);
            if (!match) {
                throw { error: 'The password is incorrect' };
            }
            return this.createToken(user);
        } catch (error) {
            console.log('something went wrong in the service layer', error.message);
            throw error;
        }
    }

    async deleteUser(userId) {
        try{
            const response = await this.userRepository.deleteUser(userId);
            return response;
        } catch(error){
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }
}

module.exports = UserService;