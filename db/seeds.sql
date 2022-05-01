INSERT INTO department (name)
VALUES
    ('HR'),
    ('Sales'),
    ('Custodial'),
    ('Software'),
    ('Security'),
    ('Management');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Manager', 100000.00, 6),
    ('Software Engineer', 80000.00, 4),
    ('Custodian', 40000.00, 3),
    ('HR Officer', 60000.00, 1),
    ('Security Guard', 60000.00, 5),
    ('Sales Associate', 70000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Jon', 'Athan', 1, NULL),
    ('Tim', 'Othy', 2, 1),
    ('Zach', 'Ary', 3, 1),
    ('Seb', 'Astian', 2, 1),
    ('Ben', 'Jamin', 4, 1),
    ('Frank', 'Lin', 6, 1),
    ('Chris', 'Topher', 5, 1);