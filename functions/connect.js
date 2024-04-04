const mysql = require("mysql")
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "4gaoffering_db"
})

connection.connect(function (err) {                   
    if (err) throw err
    console.log('database connected successfully')
})

module.exports = connection;