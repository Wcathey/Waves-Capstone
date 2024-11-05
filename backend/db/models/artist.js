'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Artist.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plays: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Other'
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len:[10, 256]
      }
    },
    label: {
      type: DataTypes.STRING

    },
  }, {
    sequelize,
    modelName: 'Artist',
  });
  return Artist;
};