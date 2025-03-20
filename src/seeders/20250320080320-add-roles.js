'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('roles',
      [
        {
          role_name: 'principal',
          createdAt: new Date(),
          updataedAt: new Date(),
        },
        {
          role_name: 'hod',
          createdAt: new Date(),
          updataedAt: new Date(),
        },
        {
          role_name: 'teacher',
          createdAt: new Date(),
          updataedAt: new Date(),
        },
        {
          role_name: 'master',
          createdAt: new Date(),
          updataedAt: new Date(),
        },
        {
          role_name: 'graduate',
          createdAt: new Date(),
          updataedAt: new Date(),
        },
        {
          role_name: 'student',
          createdAt: new Date(),
          updataedAt: new Date(),
        },
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      role_name: {
        [Op.or]: ['principal', 'hod', 'teacher', 'master', 'grad', 'student'],
      }
    });
  }
};
