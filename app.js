var express = require("express");
var app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
var bodyparser = require("body-parser")
app.use(bodyparser.urlencoded({extended:true}))

//function call Start
var connection = require("./functions/connect")
var handleAddHistory = require("./functions/add_history")
var handleExpensesHistory = require("./functions/expenses_history")
//function call end


var users, totalIncomeAmount, totalExpensesAmount //Global Variables
// Get users details from database
connection.connect(function (err){
    const user_sql = "SELECT * FROM users";
    connection.query(user_sql, function (err, result) {
        users = JSON.parse(JSON.stringify(result))
    })
})

// Getting Total Income and Total Expenses in a year 
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
// Getting Total Income and Total Expenses in a year End


app.get("/", function (req, res) {

    const date = new Date()
    const day = date.getDate()
    const year = date.getFullYear()
    const monthIndex = date.getMonth();
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const months = monthName[monthIndex];

    connection.connect(function (err) {
        const sql = `SELECT * FROM history WHERE day = "${day}" AND month = "${months}" AND year = "${year}" `;
        connection.query(sql, function (err, result) {
            const currentHistorys = JSON.parse(JSON.stringify(result))
            console.log(totalExpensesAmount)
            res.render("index", {
                users: users,
                currentHistorys:currentHistorys,
                totalIncomeAmount:totalIncomeAmount,
                totalExpensesAmount:totalExpensesAmount
            })
        })
    })
})

app.get("/add", function (req, res) {
    res.render("add", {
        users: users,
        totalIncomeAmount:totalIncomeAmount,
        totalExpensesAmount:totalExpensesAmount

    })
})

//Add Offering history
app.post("/insert_data", function (req, res) {
    handleAddHistory.handleAddHistory(req, res, connection)
})

//Add Expenses history
app.get("/expenses", function (req, res) {
    res.render("expenses", {
        users: users,
        totalIncomeAmount:totalIncomeAmount,
        totalExpensesAmount:totalExpensesAmount
    })
})

app.post("/expenses_data", function (req, res) {
    handleExpensesHistory.handleExpensesHistory(req, res, connection)
})

app.get("/history", function (req, res) {
    connection.connect(function (err) {
        const sql = "SELECT * FROM history";
        connection.query(sql, function (err, result) {
            const historys = JSON.parse(JSON.stringify(result))
            res.render("history", {
                users: users,
                totalIncomeAmount: totalIncomeAmount,
                totalExpensesAmount: totalExpensesAmount,
                historys: historys
            })        
        })
    })
})

app.get("*", function (req, res) {
    res.send("404 page ahead")
})

app.listen("3000", () => {
    console.log('we are connected')
})