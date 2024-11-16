'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      releaseDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: true
      },
      albumId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Albums",
          key: "id"
        },
        onDelete: 'CASCADE'
      },
      artistId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Artists",
          key: "id"
        },
        onDelete: 'CASCADE'
      },
      trackId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: true
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalPlays: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: true
      },
      uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Songs');
  }
};
