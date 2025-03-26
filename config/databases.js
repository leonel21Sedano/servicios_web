require('dotenv').config();
const { Sequelize } = require('sequelize');

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASSWORD;

const sequelize = new Sequelize(db_name, db_user, db_pass,{
    host: process.env.DB_HOST,
    dialect: 'mysql',
    //logging: false
});

sequelize.authenticate()
    .then(() => console.log("connected"))
    .catch(() => console.error("Error trying to connect"));

module.exports = sequelize;

