'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Playlist.belongsToMany(
        models.Song, {through: "PlaylistSongs", foreignKey: "songId", otherKey: "playlistId"}
      );
      Playlist.belongsTo(
        models.User, {foreignKey: "userId", onDelete: 'CASCADE'}
      );

    }
  }
  Playlist.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Playlist',
  });
  return Playlist;
};
