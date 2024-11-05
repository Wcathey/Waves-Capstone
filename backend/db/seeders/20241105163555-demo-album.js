'use strict';

const { Album } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Starting the seeding process...");
    try {
      await Album.bulkCreate([
        {
          name: "Album1",
          releaseDate: "01-01-2023",
          artistId: 1
        },
        {
          name: "Album2",
          releaseDate: "05-01-2000",
          artistId: 2
        },
        {
          name: "Album3",
          releaseDate: "12-01-1991",
          artistId: 3
        }
      ], { validate: true });
      console.log("Seeding process completed successfully.");
    } catch (error) {
      console.error("Error during seeding:", error);  // This will provide more details about the error

    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Albums';
    const Op = Sequelize.Op;

    try {
      await queryInterface.bulkDelete(options, {
        name: {[Op.in]: ['Album1', 'Album2', 'Album3']}
      }, {});
      console.log("Rollback process completed successfully.");

    } catch (error) {
      console.error("Error during rollback:", error);  // This will provide more details about the rollback error

    }
  }
};
