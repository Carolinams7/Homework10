var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Arrumaremprego1",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all departments",
        "View all roles",
        "Add employee",
        "Add department",
        "Add role",
        "Update employee role",
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View all employees":
        allempSearch();
        break;

      case "View all departments":
        alldepSearch();
        break;

      case "View all roles":
        allrolSearch();
        break;

      case "Add employee":
        addEmp();
        break;

      case "Add department":
        addDep();
        break;

      case "Add role":
        addRole();
        break;

      case "Update employee role":
        updateEmpRole();
        break;
      }
    });
}

function allempSearch() {
  var query = "SELECT * FROM employee";
  connection.query(query, function(err, res) {
  console.table(res)
  runSearch();
    });
  }
    
function alldepSearch() {
  var query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
  console.table(res)
  runSearch();
    });
  }

function allrolSearch() {
  var query = "SELECT * FROM role";
  connection.query(query, function(err, res) {
  console.table(res)
  runSearch();
    });
  }

  function addEmp() {
    var roles = [];
    var managers = [];
    var query = "SELECT * FROM role RIGHT JOIN employee ON role.id=employee.role_id";

    connection.query(query, function(err, res) {

      for (var i = 0; i < res.length; i++) {
            roles.push({
              name: res[i].title,
              value: res[i].role_id
            })

            managers.push({
            name: `${res[i].first_name} ${res[i].last_name}`,
            value: res[i].id
          })
       };

      var availableRoles = roles.filter((role, index, self) =>
  index === self.findIndex((t) => (
    t.value === role.value && t.name === role.name
  ))
)

      managers.push({
        name: "None",
        value: null 
      })


      // here
    inquirer
      .prompt([{
        name: "first_name", 
        type: "input",
        message: "What is the first name?"
      },{
        name: "last_name", 
        type: "input",
        message: "What is the last name?"
      },{
        name: "role", 
        type: "list",
        message: "What is the employee's role?",
        choices: availableRoles
       },{
        name: "manager", 
        type: "list",
        message: "What is the employee's manager?",
        choices: managers
       }
    ])
      .then(function(answer) {
        console.log(answer)
        var query = `INSERT into employee SET ? `;
        connection.query(query, { first_name: answer.first_name, last_name: answer.last_name, role_id: answer.role, manager_id: answer.manager }, function(err, res) {
          runSearch();
        });
      })
        })};

      function addDep() {
        inquirer
          .prompt({
            name: "department",
            type: "input",
            message: "What department would you like to add?"
      })
          .then(function(answer) {
            var query = `INSERT into department SET ? `;
            connection.query(query, { name: answer.department }, function(err, res) {
              console.log(res);
      runSearch();
    });
  });
}
      function addRole() {
        var departments = [];
        var query = "SELECT * FROM department";
    
        connection.query(query, function(err, res) {
          for (var i = 0; i < res.length; i++) {
    
                departments.push({
                name: res[i].name,
                value: res[i].id
              })
           };


        inquirer
          .prompt([
            {
            name: "role",
            type: "input",
            message: "What role would you like to add?"
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary?"
      },
      {
        name: "department_id",
        type: "list",
        message: "Which department would you like to add the role to?",
        choices: departments
      },
    ])
          .then(function(answer) {
          var query = `INSERT into role SET ? `;
          connection.query(query, { title: answer.role, salary: answer.salary, department_id: answer.department_id }, function(err, res) {
          runSearch();
    });
  });
});

  };

  function updateEmpRole() {
    var employees = [];
    var query = "SELECT * FROM employee";

    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
            employees.push({
              name: `${res[i].first_name} ${res[i].last_name}`,
              value: res[i].id
          })
       };

    inquirer
    .prompt([
      {
      name: "id",
      type: "list",
      message: "Which employee would you like to update?",
      choices: employees
    },{
      name: "option",
      type: "list",
      message: "What would you like to update?",
      choices: ["role", "manager"]
    }
  ])
    .then(function(answer) {
      if(answer.option==="role"){
        // then update the role with the newRole_id
        updateEmpRoleId(answer.id)
      }
      else if(answer.option==="manager"){
        // then update the manager id
        updateEmpManId(answer.id)
      }
    });
  });

    };

    function updateEmpRoleId (id) {
      var roles = [];
      var query = "SELECT * FROM role";
  
      connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
              roles.push({
                name: res[i].title,
                value: res[i].id
              })
         };
         inquirer
         .prompt([
     {
       name: "role_id",
       type: "list",
       message: "Choose a new role:",
       choices: roles
     },
   ])
         .then(function(answer) {
         var query = `UPDATE employee SET role_id=${answer.role_id} WHERE id=${id}`;
         connection.query(query, function(err, res) {
         runSearch();
   });
 });

        })
    }

    function updateEmpManId (id){
      var managers = [];
      var query = "SELECT * FROM role RIGHT JOIN employee ON role.id=employee.role_id";

    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
            managers.push({
            name: `${res[i].first_name} ${res[i].last_name}`,
            value: res[i].id
          })
       };
       inquirer
       .prompt([
   {
     name: "manager_id",
     type: "list",
     message: "Choose a new manager:",
     choices: managers
   },
 ])
       .then(function(answer) {
       var query = `UPDATE employee SET manager_id=${answer.manager_id} WHERE id=${id}`;
       connection.query(query, function(err, res) {
       runSearch();
 });
});
      })
  }



    
  