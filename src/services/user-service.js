const UserRepository = require('../repositories/user-repository');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data) {
        try{
            const user = await this.userRepository.insertUser(data);
            return response;
        } catch(error) {
            console.log('soething went wrong in the service layer');
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