const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to the employees_db database.`)
);

// OPTIONS: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
function giveOptions() {
  inquirer
    .prompt([
      {
        name: "option",
        type: "list",
        message: "Select an option",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee's role",
          "Quit",
        ],
      },
    ])
    .then((ans) => {
      if (ans.option === "View all departments") {
        viewDepartments();
      } else if (ans.option === "View all roles") {
        viewRoles();
      } else if (ans.option === "View all employees") {
        viewEmployees();
      } else if (ans.option === "Add a department") {
        addDepartment();
      } else if (ans.option === "Add a role") {
        addRole();
      } else if (ans.option === "Add an employee") {
        addEmployee();
      } else if (ans.option === "Update an employee's role") {
        updateRole;
      } else {
        return;
      }
    });
}
giveOptions();

// DONE: option to return to menu or quit
function end() {
  inquirer
    .prompt([
      {
        name: "endOption",
        type: "list",
        message: "Select an option",
        choices: ["Go back to menu", "Quit"],
      },
    ])
    .then((ans) => {
      if (ans.endOption === "Go back to menu") {
        giveOptions();
      } else {
        // close server?
        return;
      }
    });
}

// DONE: View all departments gives a formatted table showing department names and department ids
function viewDepartments() {
  db.query(`SELECT * FROM department`, function (err, result) {
    console.table(result);
    end();
  });
}

// DONE: View all roles gives the job title, role id, the department that role belongs to, and the salary for that role
function viewRoles() {
  db.query(
    // Set the department name column to "department"
    `SELECT title, role.id, name AS department FROM role JOIN department ON department_id=department.id`,
    function (err, result) {
      console.table(result);
      end();
    }
  );
}

// DONE: View all employess gives formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewEmployees() {
  db.query(
    // JOIN manager's first and last name as new column, maybe using ALTER TABLE, SELF JOIN
    `SELECT A.id, A.first_name, A.last_name, title, name AS department,
    CONCAT (B.first_name," ",B.last_name) AS manager FROM employee A
    LEFT JOIN employee B ON A.manager_id=B.id
    JOIN role ON A.role_id=role.id
    JOIN department ON department_id=department.id`,
    function (err, result) {
      // TODO: add error
      console.table(result);
      end();
    }
  );
}

// DONE: Add a department prompts to enter the name of the department, then add input to database
function addDepartment() {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      message: "What is the new department called?",
    })
    .then((ans) => {
      db.query(
        `INSERT INTO department(name) VALUES(?)`,
        [ans.newDepartment],
        function (err, result) {
          // TODO: add error
          console.log("The new department has been added");
          end();
        }
      );
    });
}

// TODO: Add a role prompts to enter the name, salary and department for the role, then add input to database
function addRole() {
  const departmentArray = [];
  // TODO: Include ID in department array
  db.query("SELECT department.name FROM department", function (err, result) {
    for (let i = 0; i < result.length; i++) {
      departmentArray.push(result[i].name);
    }
  });
  inquirer
    .prompt([
      {
        name: "newRole",
        type: "input",
        message: "What is the new role called?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the role's salary?",
      },
      // DONE: give options for available departments from db
      {
        name: "department",
        type: "list",
        message: "What department does this role belong to?",
        choices: departmentArray,
      },
    ])
    .then((ans) => {
      db.query(
        // TODO: add to db
        `INSERT INTO role(title) VALUES(?)`,
        [ans.newRole],
        function (err, result) {
          // TODO: add error
          console.log("The new role has been added");
          end();
        }
      );
    });
}

// TODO: Add an employee prompts to enter employee's first name, last name, and manager, then add input to database
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the new employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the new employee's last name?",
      },
      // TODO: give options for available managers from db
    ])
    .then((ans) => {
      db.query(
        `INSERT INTO employee(first_name) VALUES(?)`,
        [ans.newDepartment],
        function (err, result) {
          console.log("The new employee has been added");
          end();
        }
      );
    });
}

// TODO: Update employee's role prompts to select an employee and the new role, then add input to database
function updateRole() {
  inquirer
    .prompt([
      {
        // prompt to select from employees
      },
      {
        // prompt to select from roles
      },
    ])
    .then((ans) => {
      db.query(
        `UPDATE employee SET employee.role_id=? WHERE id=?`,
        [],
        function (err, result) {
          // TODO: add error
          console.log("The employee has been given a new role");
          end();
        }
      );
    });
}
