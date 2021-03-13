const users = require("../controllers/user.controller.js");
const jwtfn = require("../utils/jwtfn.ts");
module.exports = (app) => {
  // Create a new User
  app.post(
    "/api/users",
    jwtfn.authenticateJWT(true),
    jwtfn.minimumPermissionLevelRequired("Api_users", "post"),
    users.create
  );
  // Retrieve all Users
  app.get(
    "/api/users",
    jwtfn.authenticateJWT(true),
    jwtfn.minimumPermissionLevelRequired("Api_users", "getAll"),
    users.findAll
  );
  // Retrieve a single User with userId
  app.get(
    "/api/users/:id",
    jwtfn.authenticateJWT(true),
    jwtfn.minimumPermissionLevelRequired("Api_users", "getOne"),
    users.findOne
  );
  // Retrieve Current User with userId
  app.get(
    "/api/currentUser/:id",
    jwtfn.authenticateJWT(true),
    jwtfn.minimumPermissionLevelRequired("Api_users", "getOne"),
    users.getCurrentUser
  );
  // Update a User with userId
  app.put(
    "/api/users/:id",
    jwtfn.authenticateJWT(true),
    jwtfn.minimumPermissionLevelRequired("Api_users", "put"),
    users.update
  );
  // Delete a User with userId
  app.delete(
    "/api/users/:id",
    jwtfn.authenticateJWT(true),
    jwtfn.minimumPermissionLevelRequired("Api_users", "delete"),
    users.delete
  );
  // Attach Training to User
  app.put(
    "/api/attach",
    jwtfn.authenticateJWT(true),
    jwtfn.minimumPermissionLevelRequired("Api_users", "attach"),
    users.attachTraining
  );
};
