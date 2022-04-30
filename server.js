const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
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

const queryAllDepartments = async () => {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log(results);
    });
}

const queryAllRoles = async () => {
    db.query('SELECT * FROM role', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log(results);
    });
}

const queryAllEmployees = async () => {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log(results);
    });
}

const addDepartment = async () => {
    const prompt = [
        {
            type: 'input',
            name: 'departmentAdd',
            message: 'Enter name of new department:'
        }
    ];

    const answer = await inquirer.prompt(prompt);

    db.query(
        `INSERT INTO department (name)
        VALUES
            ('${answer.departmentAdd}');`
            , function (err, results) {
                if (err) {
                    console.log(err);
                }
                console.log(results);
    });
}

const addRole = async () => {
    const departmentArray = [];

    db.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.log(err);
        }
        return results;
    });

    const prompt = [
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for the new role?'
        },
        {
            type: 'list',
            name: 'departmentChoice',
            message: 'Which department does the new role belong to?',
            choices: departmentArray
        }
    ]


    db.query(`INSERT INTO role (title, salary)
                VALUES
                    ('Manager', 100000),`)
}

const actionsPrompt = async () => {
    const prompt = [
        {
            type: 'list',
            name: 'initialAction',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
        }
    ]

    const answer = await inquirer.prompt(prompt);

    console.log(answer);

    // if (answer.initialAction === 'View all departments') {
    //     queryAllDepartments();
    // } else if (answer.initialAction === 'View all roles') {
    //     queryAllRoles();
    // } else if (answer.initialAction === 'View all employees') {
    //     queryAllEmployees();
    // } else if (answer.initialAction === 'Add a department') {
    //     addDepartment();
    // } else if (answer.initialAction === 'Add a role') {
    //     addRole();
    // }

    
}


const initApp = async () => {
    console.log('Welcome to Employee Tracker');
    actionsPrompt();
}

initApp();