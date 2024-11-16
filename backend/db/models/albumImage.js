'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AlbumImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AlbumImage.belongsTo(
        models.Album, {foreignKey: "albumId", onDelete: 'CASCADE'}
      )
    }
  }
  AlbumImage.init({
    albumId: {
     type: DataTypes.INTEGER,
     allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'AlbumImage',
  });
  return AlbumImage;
};
