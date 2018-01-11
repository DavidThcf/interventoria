const Sequelize = require('sequelize');


function configConnection() {
    var sqlCon = require('./connectionDb.js');
    const sequelize = new Sequelize('interventoria', 'postgres', '123', {  //'NJpost2016'  Int2017IP1
        //host: 'knower.udenar.edu.co',
        host: 'localhost',
        //host: '10.20.50.97',
        dialect: 'postgres'
        
    });
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    return sequelize;
}

module.exports.configConnection=configConnection

