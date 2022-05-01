const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./connection');

const queryAllDepartments = async () => {
    let database = await db();
    database.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log(results);
    });
}

const queryAllRoles = async () => {
    let database = await db();
    database.query('SELECT role.title, role.salary, department.name FROM role RIGHT JOIN department ON role.department_id = department.id', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
}

const queryAllEmployees = async () => {
    let database = await db();
    database.query('SELECT employee.first_name, employee.last_name, role.title FROM employee RIGHT JOIN role ON employee.role_id = role.id', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
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

    let database = await db();

    database.query(
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
    let database = await db();
    
    const departmentArray = [];

    database.query('SELECT * FROM department', function (err, results) {
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

    const answers = await inquirer.prompt(prompt);

    database.query(`INSERT INTO role (title, salary)
                VALUES
                    ('${answers.title}', ${answers.salary}, ${answers.departmentChoice})`, function (err, results) {
        if (err) {
            console.log(err);
        }
        return results;
    });
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

    if (answer.initialAction === 'View all departments') {
        queryAllDepartments();
    } else if (answer.initialAction === 'View all roles') {
        queryAllRoles();
    } else if (answer.initialAction === 'View all employees') {
        queryAllEmployees();
    } else if (answer.initialAction === 'Add a department') {
        addDepartment();
    } else if (answer.initialAction === 'Add a role') {
        addRole();
    }

    
}

const initApp = async() => {
    console.log('What would you like to do?');
    actionsPrompt();
}

initApp();

