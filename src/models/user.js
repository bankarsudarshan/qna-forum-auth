'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { SALT } = require('../config/server-config');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Level, {
        foreignKey: 'level_id',
        targetKey: 'id',
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [5, 50],
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Level',
        key: 'id',
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 16],
      }
    },
    level_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Level',
        key: 'id',
      },
      defaultValue: 6,
    },
    last_login_at: {
      type: DataTypes.DATE,
    },
    about: {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });

  User.beforeCreate((user) => {
    const encryptedPassword = bcrypt.hashSync(user.password, SALT);
    user.password = encryptedPassword;
  })
  return User;
};