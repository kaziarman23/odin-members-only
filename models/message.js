module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      text: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: "messages",
      timestamps: true,
    }
  );

  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: "authorId", as: "author" });
  };

  return Message;
};
