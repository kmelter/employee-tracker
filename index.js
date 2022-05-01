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
    database.query('SELECT employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id FROM employee INNER JOIN role ON employee.role_id = role.id', function (err, results) {
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
                console.log('Department added');
    });
}

const addRole = async () => {

    let database = await db();
    
    let departmentArrayRaw = [];
    const departmentNameArray = [];


    database.query('SELECT * FROM department', function (err, results) {
        
        if (err) {
            console.log(err);
        }
        
        departmentArrayRaw = results;
        console.log(departmentArrayRaw);
    
        
        departmentArrayRaw.forEach((element) => {
            let departmentRaw = JSON.stringify(element);
            departmentSliced = departmentRaw.slice(16, -2);
            departmentNameArray.push(departmentSliced);
        })

        console.log(departmentNameArray);

        // for (let i = 1; i < departmentArrayRaw.length + 1; i++) {
        //     database.query(`SELECT name FROM department WHERE id = ${i}`, function (err, results) {
        //         if (err) {
        //             console.log(err);
        //         }
        //         departmentNameArray.push(results);
        //     });
        // }
        // console.log(departmentNameArray);
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
            choices: departmentNameArray
        }
    ]

    const answers = await inquirer.prompt(prompt);

    let chosenDepartmentId = database.query(`SELECT id FROM department WHERE name IN ('${answers.departmentChoice}')`, function (err, results) {
        if (err) {
            console.log(err);
        }
        return results;
    });

    console.log(chosenDepartmentId);

    // database.query(`INSERT INTO role (title, salary, department_id)
    //             VALUES
    //                 ('${answers.title}', ${answers.salary}, ${chosenDepartmentId})`, function (err, results) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     return results;
    // });
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

