'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Photos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      albumId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Albums",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      imgUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Добавляем индекс для оптимизации запросов по albumId
    await queryInterface.addIndex('Photos', ['albumId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Photos");
  }
};