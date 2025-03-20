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
    await queryInterface.bulkInsert('levels',
      [
        {
          level_name: 'principal',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          level_name: 'hod',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          level_name: 'teacher',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          level_name: 'master',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          level_name: 'graduate',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          level_name: 'student',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('levels', {
      level_name: {
        [Op.or]: ['principal', 'hod', 'teacher', 'master', 'grad', 'student'],
      }
    });
  }
};
