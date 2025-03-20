const UserRepository = require('../repositories/user-repository');
const jwt = require('jsonwebtoken');
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