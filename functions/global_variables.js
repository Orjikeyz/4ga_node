
const globalVariables = function (connection) {
var users, totalIncomeAmount, totalExpensesAmount //Global Variables
// Get users details from database
connection.connect(function (err){
    const user_sql = "SELECT * FROM users";
    connection.query(user_sql, function (err, result) {
        users = JSON.parse(JSON.stringify(result))
    })
})

connection.connect(function (err) {
    const date = new Date()
    const day = date.getDate()
    const year = date.getFullYear()
    const sql = `SELECT SUM(amount) AS total_amount FROM history WHERE year = ${year} AND source = 'income'`;
    connection.query(sql, function (err, result) {
             totalIncomeAmount = JSON.parse(JSON.stringify(result))  
             const sql = `SELECT SUM(amount) AS total_amount FROM history WHERE year = ${year} AND source = 'expenses'`;
             connection.query(sql, function (err, result) {
                      totalExpensesAmount = JSON.parse(JSON.stringify(result))  
             })
    })
})
}

module.exports = {globalVariables}