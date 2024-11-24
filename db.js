const mysql = require('mysql2');
const dotenv = require('dotenv');

// load enivornment variables from .env file
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

//connect to the database

db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database: ",err.message);
    }else{
        console.log("database connected successfully");
    }
})

module.exports = db;