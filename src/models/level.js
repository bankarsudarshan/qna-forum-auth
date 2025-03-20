'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Level extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User, {
        foreignKey: 'level_id',
        sourceKey: 'id',
        onDelete: 'RESTRICT',
        onUpdate: 'UPDATE',
      });
    }
  }
  Level.init({
    level_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Level',
    tableName: 'levels',
  });
  return Level;
};