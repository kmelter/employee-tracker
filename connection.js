const mysql = require('mysql2');

// Connect to database
// const db = mysql.createConnection(
//     {
//       host: 'localhost',
//       // MySQL username,
//       user: 'root',
//       // MySQL password
//       password: '',
//       database: 'tracker'
//     },
//     console.log(`Connected to the tracker database.`)
// );
const db = async() => {
    return mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'tracker'
    },
    console.log(`Connected to the tracker database.`)
    );
}

module.exports = db;