"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DataTypes: Sequelize } = require("sequelize");
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("File", {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      extension: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mimeType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      uploadDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("File");
  },
};
