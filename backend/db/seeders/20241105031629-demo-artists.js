'use strict';

const { Artist } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Starting the seeding process...");
    try {
      await Artist.bulkCreate([

        {
          name: "Band1",
          city: "Los Angeles",
          state: "California",
          plays: 0,
          genre: "Rock",
          bio: "Demo band name and bio for testing purposes only",
          label: "none",
          memberId: 1
        },
        {
          name: "Band2",
          city: "Austin",
          state: "Texas",
          plays: 25,
          genre: "Indie",
          bio: "Demo band name and bio for testing purposes only",
          label: "Eulogy",
          memberId: 2
        },
        {
          name: "Band3",
          city: "Dallas",
          state: "Texas",
          plays: 100000,
          genre: "Metal",
          bio: "Demo band name and bio for testing purposes only",
          label: "HeavyMetal",
          memberId: 2
        }
      ], { validate: true });
      console.log("Seeding process completed successfully.");
    } catch (error) {
      console.error("Error during seeding:", error);  // This will provide more details about the error
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Artists';
    const Op = Sequelize.Op;

    try {
      await queryInterface.bulkDelete(options, {
        name: { [Op.in]: ['Band1', 'Band2', 'Band3']}
      }, {});
      console.log("Rollback process completed successfully.");

    } catch (error) {
      console.error("Error during rollback:", error);  // This will provide more details about the rollback error

    }
  }
};
