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
        updateRole();
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
        return;
      }
    });
}

// DONE: View all departments gives a formatted table showing department names and department ids
function viewDepartments() {
  db.query(`SELECT * FROM department`, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
      end();
    }
  });
}

// DONE: View all roles gives the job title, role id, the department that role belongs to, and the salary for that role
function viewRoles() {
  db.query(
    // Set the department name column to "department"
    `SELECT title, role.id, name AS department FROM role JOIN department ON department_id=department.id`,
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.table(result);
        end();
      }
    }
  );
}

// DONE: View all employess gives formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewEmployees() {
  db.query(
    // JOIN manager's first and last name as new column, maybe using ALTER TABLE or SELF JOIN?
    `SELECT A.id, A.first_name, A.last_name, title, name AS department,
    CONCAT (B.first_name," ",B.last_name) AS manager FROM employee A
    LEFT JOIN employee B ON A.manager_id=B.id
    JOIN role ON A.role_id=role.id
    JOIN department ON department_id=department.id`,
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.table(result);
        end();
      }
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
          if (err) {
            console.log(err);
          } else {
            console.log("The new department has been added");
            console.table(result);
            end();
          }
        }
      );
    });
}

// DONE: Add a role prompt to enter the name, salary and department for the role, then add input to database
function addRole() {
  const departmentArray = [];
  // DONE: Include ID in department array
  db.query("SELECT * FROM department", function (err, result) {
    for (let i = 0; i < result.length; i++) {
      departmentArray.push({
        name: result[i].name,
        value: result[i].id,
      });
    }
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
        console.log(ans);
        db.query(
          // TODO: add to db
          `INSERT INTO role(title,salary,department_id) VALUES(?,?,?)`,
          [ans.newRole, ans.salary, ans.department],
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("The new role has been added");
              console.log(result);
              end();
            }
          }
        );
      });
  });
}

// DONE: Add an employee prompts to enter employee's first name, last name, and manager, then add input to database
function addEmployee() {
  const employeeArray = [];
  const roleArray = [];
  db.query("SELECT * FROM employee", function (err, result) {
    for (let i = 0; i < result.length; i++) {
      employeeArray.push({
        name: `${result[i].first_name} ${result[i].last_name}`,
        value: result[i].id,
      });
    }
  });
  db.query("SELECT * FROM role", function (err, result) {
    for (let i = 0; i < result.length; i++) {
      roleArray.push({
        name: result[i].title,
        value: result[i].id,
      });
    }
  });
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
      {
        name: "manager",
        type: "list",
        message: "Who is the new employee's manager?",
        choices: employeeArray,
      },
      {
        name: "role",
        type: "list",
        message: "Who is the new employee's role?",
        choices: roleArray,
      },
    ])
    .then((ans) => {
      db.query(
        `INSERT INTO employee(first_name,last_name,manager_id,role_id) VALUES(?,?,?,?)`,
        [ans.firstName, ans.lastName, ans.manager, ans.role],
        function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("The new employee has been added");
            console.log(result);
            end();
          }
        }
      );
    });
}

// DONE: Update employee's role prompts to select an employee and the new role, then add input to database
function updateRole() {
  const employeeArray = [];
  const roleArray = [];
  db.query("SELECT * FROM employee", function (err, result) {
    for (let i = 0; i < result.length; i++) {
      employeeArray.push({
        name: `${result[i].first_name} ${result[i].last_name}`,
        value: result[i].id,
      });
    }
    db.query("SELECT * FROM role", function (err, result) {
      for (let i = 0; i < result.length; i++) {
        roleArray.push({
          name: result[i].title,
          value: result[i].id,
        });
      }
      inquirer
        .prompt([
          {
            name: "employeeId",
            type: "list",
            message: "Which employee?",
            choices: employeeArray,
          },
          {
            name: "roleId",
            type: "list",
            message: "Who is the employee's new role?",
            choices: roleArray,
          },
        ])
        .then((ans) => {
          db.query(
            `UPDATE employee SET employee.role_id=? WHERE id=?`,
            [ans.roleId, ans.employeeId],
            function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log("The employee has been given a new role");
                console.table(result);
                end();
              }
            }
          );
        });
    });
  });
}
