// MODIFY THE CONST VARIABLES
const adminName = "testAdmin";
const adminPass = "testPass";
const dbUser = "dbUser";
const dbUserPass = "dbPass";

use admin
db.createUser({
  user: adminName,
  pwd: adminPass,
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
});
db.auth( adminName, adminPass)

// CHANGE dbName TO THE DB THAT YOU ARE USING
use dbName
db.createUser({
  user:dbUser,
  pwd:dbUserPass,
  roles:[{
    role:"dbOwner",
    db:"dbName"
  }]
})