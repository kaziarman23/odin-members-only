const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      isMember: { type: DataTypes.BOOLEAN, defaultValue: false },
      isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  User.prototype.validatePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.beforeCreate(async (user, options) => {
    // ensure passwordHash already set by signup flow; no-op here
  });

  User.associate = (models) => {
    User.hasMany(models.Message, {
      foreignKey: "authorId",
      as: "messages",
      onDelete: "CASCADE",
    });
  };

  return User;
};
