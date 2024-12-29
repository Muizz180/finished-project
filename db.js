require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

db.getConnection()
    .then((connection) =>{
        console.log('Connected to MYSQL successfully!');
        connection.release();
    })
        .catch((error)=>{
            console.error('Error connecting to MYSQL:', error.message);
        })

module.exports= db;