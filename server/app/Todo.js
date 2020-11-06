import Sequelize from 'sequelize'
import connection from '../database/config'

const Todo = connection.define('todos', {
    todoId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,
        min: 4,
        max: 40,
    },

    content: {
        type: Sequelize.STRING,
        allowNull: false,
        min: 5,
        max: 255
    },

    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },

    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
    },

    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
})

export default Todo
