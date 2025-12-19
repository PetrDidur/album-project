"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
  "AlbumAccesses",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    role: {
      type: Sequelize.ENUM("viewer", "editer"),
      defaultValue: "viewer",
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    albumId: {
      type: Sequelize.INTEGER,
      references: {
        model: "Albums",
        key: "id",
      },
      onDelete: "CASCADE",
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
  },
  {
    uniqueKeys: {
      unique_pair: {
        fields: ["userId", "albumId"],
      },
    },
  }
);

  },
  async down(queryInterface) {
    await queryInterface.dropTable("AlbumAccesses");
  },
};
