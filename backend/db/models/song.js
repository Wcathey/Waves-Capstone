'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Song.belongsTo(
        models.Album, {foreignKey: "albumId", onDelete: 'CASCADE'}
      );
      Song.belongsTo(
        models.Artist, {foreignKey: "artistId", onDelete: 'CASCADE'}
      );
      Song.hasOne(
        models.Upload, {foreignKey: "songId", onDelete: 'CASCADE'}
      );
      Song.belongsToMany(
        models.Playlist, {through: 'PlaylistSongs', foreignKey: "playlistId", otherKey: "songId"}
      )
    }
  }
  Song.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    trackId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalPlays: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Song',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Song;
};
