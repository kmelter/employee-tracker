const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./connection');

const queryAllDepartments = async () => {
    let database = await db();
    database.query('SELECT * FROM department;', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
}

const queryAllRoles = async () => {
    let database = await db();
    database.query('SELECT role.title, role.salary, department.name FROM role RIGHT JOIN department ON role.department_id = department.id;', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
}

const queryAllEmployees = async () => {
    let database = await db();
    database.query('SELECT employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id FROM employee INNER JOIN role ON employee.role_id = role.id;', function (err, results) {
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


    database.query('SELECT * FROM department;', function (err, results) {
        
        if (err) {
            console.log(err);
        }
        
        departmentArrayRaw = results;
        
        departmentArrayRaw.forEach((element) => {
            let departmentRaw = JSON.stringify(element);
            departmentSliced = departmentRaw.slice(16, -2);
            departmentNameArray.push(departmentSliced);
        })
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

    database.query(`SELECT id FROM department WHERE name IN ('${answers.departmentChoice}');`, function (err, results) {
        if (err) {
            console.log(err);
        }
        
        let resultString = JSON.stringify(results);
        let chosenDepartmentId = resultString.slice(7, -2);

        //console.log(chosenDepartmentId);

        database.query(`INSERT INTO role (title, salary, department_id)
                    VALUES
                        ('${answers.title}', ${answers.salary}, ${chosenDepartmentId});`, function (err, results) {
            if (err) {
                console.log(err);
            }
            console.log('Role added');
        });
    });
}

const addEmployee = async () => {
    
    let database = await db();

    let roleArrayRaw = [];
    const roleNameArray = [];
    
    let firstNameArrayRaw = [];
    let lastNameArrayRaw = [];
    const empFirstNameArray = [];
    const empLastNameArray = [];
    const empFullNameArray = [];

    let chosenRoleId = '';
    let chosenManagerId = '';

    database.query('SELECT title FROM role', function (err, results) {
        
        if (err) {
            console.log(err);
        }
        
        roleArrayRaw = results;
        
        roleArrayRaw.forEach((element) => {
            let roleRaw = JSON.stringify(element);
            roleSliced = roleRaw.slice(10, -2);
            roleNameArray.push(roleSliced);
        })
        //console.log(roleNameArray);
    });

    // database.query('SELECT first_name FROM employee', function (err, results) {
        
    //     if (err) {
    //         console.log(err);
    //     }
    //     //console.log(results);
    //     firstNameArrayRaw = results;
        
    //     firstNameArrayRaw.forEach((element) => {
    //         let firstRaw = JSON.stringify(element);
    //         firstSliced = firstRaw.slice(15, -2);
    //         empFirstNameArray.push(firstSliced);
    //     })
    //     //console.log(empFirstNameArray);
    // });

    database.query('SELECT last_name FROM employee;', function (err, results) {
        
        if (err) {
            console.log(err);
        }
        //console.log(results);
        lastNameArrayRaw = results;
        
        lastNameArrayRaw.forEach((element) => {
            let lastRaw = JSON.stringify(element);
            lastSliced = lastRaw.slice(14, -2);
            empLastNameArray.push(lastSliced);
        })
        //console.log(empLastNameArray);
    });



    const prompt = [
        {
            type: 'input',
            name: 'first',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'last',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'employee_role',
            message: "What is the employee's role?",
            choices: roleNameArray
        },
        {
            type: 'list',
            name: 'employee_manager',
            message: "Who is the employee's manager?",
            choices: empLastNameArray
        }
    ]

    const answers = await inquirer.prompt(prompt);

    //console.log(answers);

    database.query(`SELECT id FROM role WHERE title IN ('${answers.employee_role}');`, function(err, results) {
        if (err) {
            console.log(err);
        }

        let resultString = JSON.stringify(results);
        chosenRoleId = resultString.slice(7, -2);

        console.log(chosenRoleId);
    
    
        database.query(`SELECT id FROM employee WHERE last_name IN ('${answers.employee_manager}');`, function(err, results) {
            if (err) {
                console.log(err);
            }

            let resultString = JSON.stringify(results);
            chosenManagerId = resultString.slice(7, -2);

            console.log(chosenManagerId);
    
        
            database.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.first}', '${answers.last}', ${chosenRoleId}, ${chosenManagerId});`, function (err, results) {
                if (err) {
                    console.log(err);
                }
                console.log('Employee added');
            });
        });
    });
}

const updateEmployee = async () => {
    let database = await db();
    const empNameArray = [];
    const updateRoleArray = [];

    const newRolePrompt = async (updateRoleArray, answerArray) => {
        const prompt = [
            {
                type: 'list',
                name: 'updatedRole',
                message: 'Which role do you want ot assign the selected employee?',
                choices: updateRoleArray
            }
        ]

        const answer = await inquirer.prompt(prompt);

        database.query(`SELECT id FROM role WHERE title IN ('${answer.updatedRole}')`, function(err, result) {
            if (err) {
                console.log(err);
            }
            const roleIdString = JSON.stringify(result);
            const roleIdSlice = roleIdString.slice(7, -2); //roleIdSlice is an integer representing the id
            database.query(`SELECT id FROM employee WHERE first_name IN ('${answerArray[0]}')`, function(err, result) {
                if (err) {
                    console.log(err);
                }
                const empIdString = JSON.stringify(result);
                const empIdSlice = empIdString.slice(7, -2);
                database.query(`UPDATE employee SET role_id = ${roleIdSlice} WHERE id = ${empIdSlice};`, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Employee updated');
                });
            });
        });
    }

    const newRoleQuery = async (answerArray) => {
        database.query(`SELECT title FROM role;`, function(err, result) {
            if (err) {
                console.log(err);
            }
            result.forEach((element) => {
                let updatedRoleString = JSON.stringify(element);
                let updateRoleSlice = updatedRoleString.slice(10, -2);
                updateRoleArray.push(updateRoleSlice);
            });
            //console.log(updateRoleArray);
            newRolePrompt(updateRoleArray, answerArray);
        });
    }

    const updatePrompt = async (empNameArray) => {
        const prompt = [
            {
                type: 'list',
                name: 'employeeUpdate',
                message: 'Which employee would you like to update?',
                choices: empNameArray
            }
        ]
        
        const answer = await inquirer.prompt(prompt);
        const answerString = JSON.stringify(answer);
        const answerSlice = answerString.slice(19, -2);
        const answerArray = answerSlice.split(" ");
    
        //console.log(answerArray);

        newRoleQuery(answerArray);
    }

    database.query(`SELECT first_name, last_name FROM employee;`, function(err, results) {
        if (err) {
            console.log(err);
        }
        console.log(results);
        results.forEach((element) => {
            let empNameTemp = element.first_name.concat(" ", element.last_name);
            empNameArray.push(empNameTemp);
        })
        updatePrompt(empNameArray);
    })

    
    
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

    if (answer.initialAction === 'View all departments') {
        await queryAllDepartments();
    } else if (answer.initialAction === 'View all roles') {
        await queryAllRoles();
    } else if (answer.initialAction === 'View all employees') {
        await queryAllEmployees();
    } else if (answer.initialAction === 'Add a department') {
        await addDepartment();
    } else if (answer.initialAction === 'Add a role') {
        await addRole();
    } else if (answer.initialAction === 'Add an employee') {
        await addEmployee();
    } else if (answer.initialAction === 'Update an employee') {
        await updateEmployee();
    }
}

const initApp = async() => {
    while (true) {
        console.log('What would you like to do?');
        await actionsPrompt();
    }
}

initApp();

