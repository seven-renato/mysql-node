const mysql = require("mysql")

const pool = mysql.createPool({
    connectionLimit: 10, // No maximo 10 conexões, retirando as conexões inativas
    host: "localhost",
    user: "root",
    password: "",
    database: "nodemysql2",
})

module.exports = pool