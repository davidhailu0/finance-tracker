"use strict";
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("users", [
      {
        name: "Demo User",
        email: "demo@example.com",
        passwordHash: "$2b$10$O2bL...hash...", // pre-hash for seed
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("users", { email: "demo@example.com" });
  },
};