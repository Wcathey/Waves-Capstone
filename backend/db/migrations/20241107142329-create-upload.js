'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Uploads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      songId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Songs",
          key: "id"
        },
        onDelete: 'CASCADE'
      },
      asset_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      public_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      version_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      signature: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resource_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bytes: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      etag: {
        type: Sequelize.STRING,
        allowNull: false
      },
      placeholder: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      secure_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      asset_folder: {
        type: Sequelize.STRING
      },
      display_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      original_filename: {
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
    await queryInterface.dropTable('Uploads');
  }
};
