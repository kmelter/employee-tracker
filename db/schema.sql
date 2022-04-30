DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id: INT PRIMARY KEY,
    name: VARCHAR(30)
);

CREATE TABLE role (
    id: INT PRIMARY KEY,
    title: VARCHAR(30),
    salary: DECIMAL (10,2),
    department_id: INT REFERENCES department(id)
);

CREATE TABLE employee (
    id: INT PRIMARY KEY,
    first_name: VARCHAR(30),
    last_name: VARCHAR(30),
    role_id: INT REFERENCES role(id),
    manager_id: INT DEFAULT NULL REFERENCES employee(id)
);