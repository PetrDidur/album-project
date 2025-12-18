'use strict';
const bcrypt = require("bcrypt");


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('Users', [{
       userName: 'John Doe',
       email: 'john@doe.ru',
       password: await bcrypt.hash("123456", 10),

     }], {});
  },

  async down (queryInterface) {
     await queryInterface.bulkDelete('Users', null, {});
     
  }
};
