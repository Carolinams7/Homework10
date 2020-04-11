USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("Sales"), ("Engineer"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("salesperson", 70000, 1), ("software engineer", 170000, 2), ("accountant", 90000, 3), ("laywer", 130000, 4);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("John", "Doe", 1, NULL);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Ashley", "Cooper", 2, NULL);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Mike", "Smith", 1, 1);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Alicia", "Peters", 4, NULL);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Vanessa", "Sayer", 3, NULL);




