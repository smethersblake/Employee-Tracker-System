const mysql = require('mysql2')
const express = require('express');
const inquirer = require('inquirer');
const consoleTable = require("console.table")
const PORT = process.env.PORT || 3006
const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
const db = mysql.createConnection(
    {
        host: 'localhost',
        // user name
        user: 'root',
        // password
        password: 'root',
        // database
        database: 'employee_tracker'
    },
    console.log('Connected to the employee_tracker database.')
)
db.connect((err) =>
{
    if (err) throw err
    employeeSearch()
})

function employeeSearch ()
{
    inquirer.prompt(
    {
        name: 'pick',
        type: 'list',
        message: 'Please make a selection.',
        choices:
            [
                'View All Employees',
                'View Department',
                'View role',
                'Search by Manager',
                'Search by Department',
                'Add Employee',
                'Add Department',
                'Add Role', 
                'Update Role',
                'Update Employee Manager',
                'Delete Employee',
                'Delete Role',
                'Delete Department',
                'Quit'
            ]
    })
    .then(function (res)
    {
        console.log(res)
        switch (res.pick) 
        {
            case 'View All Employees':
                viewAllEmployees()
                break
            case 'View Department':
                viewAllDepartments()
                break
            case 'View role':
                viewAllRoles()
                break
            case 'Add Employee':
                addEmployee()
                break
            case 'Add Department':
                addDepartment()
                break
            case 'Add Role':
                addRole()
                break
            case 'Update Role':
                updateEmployeeRole()
                break
            case 'Delete Employee':
                deleteEmployee()
                break
            case 'Delete Role':
                deleterole()
                break
            case 'Delete Department':
                deleteDepartment()
                break
            case 'Update Employee Manager':
                updateEmployeeManager()
                break
            case 'Search by Manager':
                searchMangerID()
                break
            case 'Search by Department':
                searchDeptID()
                break
            case 'Quit':
                db.end()
        }
    })
}
function viewAllEmployees ()
{
    var query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name," ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`
    db.query(query, function (err, res)
    {
        console.table(res)
        employeeSearch()
    })
}
function viewAllDepartments ()
{
    var query = 'SELECT * FROM department'
    db.query(query, function (err, res)
    {
        console.table(res)
        employeeSearch()
    })
}
function viewAllRoles ()
{
    var query = 'SELECT * FROM role'
    db.query(query, function (err, res)
    {
        console.table(res)
        employeeSearch()
    })
}
function addEmployee ()
{
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "What is the employee's firts name?",
            validate: firstName =>
            {
                if (firstName)
                {
                    return true
                }
                else
                {
                    console.log("Please enter a first name.")
                    return false
                }
            }
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What is the employee's last name?",
            validate: lastName =>
            {
                if (lastName)
                {
                    return true
                }
                else
                {
                    console.log("Please enter a last name.")
                    return false
                }
            }
        },
        {
            name: 'employeeRole',
            type: 'input',
            message: "What is the employee's role ID?",
        },
        {
            name: 'managerId',
            type: 'input',
            message: "Enter the employee's manager's ID number"
        }
    ])
        .then(function (res)
        {
            const firstName = res.firstName
            const lastName = res.lastName
            const managerId = res.managerId
            const employeeRole = res.employeeRole
            const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", "${employeeRole}", "${managerId}")`
            db.query(query, function (err, res)
            {
                if (err)
                {
                    throw err
                }
                console.table(res)
                employeeSearch()
            })
    })
}
function addDepartment ()
{
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: "What is the new department's name?"
    })
        .then(function (res)
        {
            const departmentName = res.departmentName
            const query = `INSERT INTO department (name) VALUES ("${departmentName}")`
            db.query(query, function (err, res)
            {
                if (err)
                {
                    throw err
                }
                console.table(res)
                employeeSearch()
            })
    })
}
function addRole ()
{
    inquirer.prompt([
        {
            name: 'roleName',
            type: 'input',
            message: "Enter the new role title"
        },
        {
            name: 'salary',
            type: 'input',
            message: "Enter the role's salary.",
            validate: salary =>
            {
                if (salary)
                {
                    return true
                }
                else
                {
                    console.log("Please enter a salary")
                    return false
                }
            }
        },
        {
            name: 'roleDeptID',
            type: 'input',
            message: "What is the department ID for the role?"
        }
    ])
        .then(function (res)
        {
            const title = res.roleName
            const salary = res.salary
            const departmentID = res.roleDeptID
            const query = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", "${salary}", "${departmentID}")`
            db.query(query, function (err, res)
            {
                if (err)
                {
                    throw err;
                }
                console.table(res)
                employeeSearch()
            })
    })
}
function updateEmployeeRole ()
{
    inquirer.prompt([
        {
            name: "updateEmploy",
            type: "input",
            message: "Enter the employee's ID you want to be updated"
            
        },
        {
            name: "newRole",
            type: "input",
            message: "Enter the new role ID for that employee"
            
        }
    ])
        .then(function (res) 
        {
        const updateEmploy = res.updateEmploy;
        const newRole = res.newRole;
        const query = `UPDATE employee SET role_id = "${newRole}" WHERE id = "${updateEmploy}"`;
        db.query(query, function (err, res) {
            if (err) 
            {
            throw err;
        }
        console.table(res);
        employeeSearch();
        })
    });
}
function deleteEmployee ()
{
    inquirer.prompt(
        {
            name: 'deleteEmployee',
            type: 'input',
            message: "Enter the ID of the employee you want to remove."
        }
    )
        .then(function (res)
        {
            const deleteEmployee = res.deleteEmployee
            const query = `DELETE from employee where id=${deleteEmployee}`
            db.query(query, function (err, res)
            {
                if (err)
                {
                    throw err
                }
            console.table(res);
            employeeSearch();
            })
    })
}
function deleterole ()
{
    inquirer.prompt(
        {
            name: 'deleteRole',
            type: 'input',
            message: "Enter the ID of the role you want to remove."
        }
    )
        .then(function (res)
        {
            const deleteRole = res.deleteRole
            const query = `DELETE FROM role where id=${deleteRole}`
            db.query(query, function (err, res)
            {
                if (err)
                {
                    throw err
                }
            console.table(res);
            employeeSearch();
            })
    })
}
function deleteDepartment ()
{
    inquirer.prompt(
        {
            name: 'deleteDepartment',
            type: 'input',
            message: "Enter the ID of the department you want to remove."
        }
    )
        .then(function (res)
        {
            const deleteDepartment = res.deleteDepartment
            const query = `DELETE from department where id=${deleteDepartment}`
            db.query(query, function (err, res)
            {
                if (err)
                {
                    throw err
                }
            console.table(res);
            employeeSearch();
            })
    })
}
function updateEmployeeManager ()
{
    inquirer.prompt([
        {
            name: "updateEmployeeManager",
            type: "input",
            message: "Enter the employee's ID you want to be updated"
            
        },
        {
            name: "newManager",
            type: "input",
            message: "Enter the new Manager ID for that employee"
            
        }
    ])
        .then(function (res) 
        {
        const updateEmployeeManager = res.updateEmployeeManager;
        const newManager = res.newManager;
        const query = `UPDATE employee SET manager_id = "${newManager}" WHERE id = "${updateEmployeeManager}"`;
        db.query(query, function (err, res) {
            if (err) 
            {
            throw err;
        }
        console.table(res);
        employeeSearch();
        })
    });
}
function searchMangerID ()
{
    inquirer.prompt(
        {
            name: "searchMangerID",
            type: "list",
            message: "Please select a manager to see thier workers",
            choices: [
                'Anita Naylor',
                'Willie Stroker',
                'Eaton Beaver',
                'Buck Nekkid',
                'Clint Torres'
            ]

        }
    )
        .then(function (res) 
        {
            switch (res.searchMangerID)
            {
                case 'Anita Naylor':
                    var searchByMangerID = 1
                    // const query = `SELECT employee.first_name, employee.last_name, CONCAT(manager.first_name," ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id WHERE employee.manager_id = ${searchByMangerID}`;
                    break
                case 'Willie Stroker':
                    var searchByMangerID = 2
                    break
                case 'Eaton Beaver':
                    var searchByMangerID = 3
                    break
                case 'Buck Nekkid':
                    var searchByMangerID = 4
                    break
                case 'Clint Torres':
                    var searchByMangerID = 5
                    break
            }
        const query = `SELECT employee.first_name, employee.last_name, CONCAT(manager.first_name," ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id WHERE employee.manager_id = ${searchByMangerID}`;
        db.query(query, function (err, res) {
            if (err) 
            {
            throw err;
        }
        console.table(res);
        employeeSearch();
        })
    });
}
function searchDeptID ()
{
    inquirer.prompt(
        {
            name: "searchDeptID",
            type: "input",
            message: "Please select a department ID to see thier workers",
        }
    )
        .then(function (res) 
        {
        const query = `SELECT employee.first_name, employee.last_name, department.name AS department FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE role.department_id = ${res.searchDeptID}`
        db.query(query, function (err, res) {
            if (err) 
            {
            throw err;
        }
        console.table(res);
        employeeSearch();
        })
    });
}