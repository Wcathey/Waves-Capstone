'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Album.belongsTo(
        models.Artist, {foreignKey: "artistId", onDelete: "CASCADE"}
      )
    }
  }
  Album.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        customDateCheck(value) {
          if(new Date(value) > new Date()) {
            throw new Error("Release date can not be in the future")
          }

        }
      }
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};
