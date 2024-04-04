const handleExpensesHistory = function (req, res, connection) {
    const data = req.body;
const currentDate = new Date();

const day = currentDate.getDate();
const year = currentDate.getFullYear();
const monthIndex = currentDate.getMonth();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthName = months[monthIndex];
console.log(day, monthName, year)
const source = "expenses"

connection.connect(function (err) {
    const sql = `INSERT INTO history (amount, category, service, day, month, year, source) VALUES ('${data.amount}', '${data.expenses_category}', '${data.service_day}', '${day}', '${monthName}', '${year}', '${source}')`;
    connection.query(sql, function (err, result) {
        if (err) throw err
        console.log("1 Item inserted")  
        res.send(`
        <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
        <script>
            window.onload = function () {
                swal("SUCCESS", "Your Request Was Successful", "success")
                setTimeout(function (){
                    window.location.href = '/'
                }, 2000)
            }
        </script>
        `)
    })
})
}
module.exports = {handleExpensesHistory} 