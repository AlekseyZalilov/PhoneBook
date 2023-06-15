const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME, // Название БД
    process.env.DB_USER, // Пользователь
    process.env.DB_PASSWORD, // ПАРОЛЬ
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)

// const { Client } = require('pg');
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'phonebook',
//   password: '1234',
//   port: 5432,
// });

// client.connect((err) => {
//   if (err) {
//     console.error('Error connecting to PostgreSql database', err.stack);
//   } else {
//     console.log('Connected to PostgreSql database');
//   }
//   client.end();
// });



// module.exports = client;
