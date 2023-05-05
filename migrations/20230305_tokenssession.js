const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('tokens_session', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('tokens_session')
  },
}