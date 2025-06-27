// This file exists because Sequelize only support import config as a string path, not an object
const config = require('../../config/config').sqlDB;
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../../.env') });

module.exports = {
    development: {
        username: config.user,
        password: config.password,
        database: config.database,
        host: config.host,
        port: config.port,
        dialect: config.dialect || 'postgres',
    },
    test: {
        username: config.user,
        password: config.password,
        database: config.database,
        host: config.host,
        port: config.port,
        dialect: config.dialect || 'postgres',
    },
    production: {
        username: config.user,
        password: config.password,
        database: config.database,
        host: config.host,
        port: config.port,
        dialect: config.dialect || 'postgres',
    },
};
