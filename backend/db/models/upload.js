'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Upload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Upload.belongsTo(
        models.Song, {foreignKey: "songId", onDelete: 'CASCADE'}
      )
    }
  }
  Upload.init({
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    asset_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    version_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resource_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bytes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    etag: {
      type: DataTypes.STRING,
      allowNull: false
    },
    placeholder: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    secure_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    playback_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    asset_folder: {
      type: DataTypes.STRING
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    original_filename: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Upload',
  });
  return Upload;
};
