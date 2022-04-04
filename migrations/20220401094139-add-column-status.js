"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("hours", "status", {
      type: Sequelize.ENUM("pending", "approved"),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("hours", "status");
  },
};
