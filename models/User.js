const Sequelize = require('sequelize');
const mysql2= require('mysql2');

const sequelize = new Sequelize('express-db', process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialectModule: mysql2,
  dialect: 'mysql'
});

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING
  }
}, {
  // options
});

module.exports = User;
