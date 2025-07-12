"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash("123456", 10);

    return queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Danielly Benicio",
          email: "daniellybeniciodearaujo@gmail.com",
          password: passwordHash,
          accessType: "admin",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", {
      email: "daniellybeniciodearaujo@gmail.com",
    });
  },
};
