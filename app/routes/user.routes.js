const users = require("../controllers/user.controller.js");
const jwtfn = require("../utils/jwtfn.ts");
module.exports = (app) => {
  // Create a new User
  app.post("/api/users", jwtfn.authenticateJWT, users.create);
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
    jwtfn.minimumPermissionLevelRequired("Api_users", "getAll"),
    users.findOne
  );
  // Attach Training to User
  app.put("/api/attach", jwtfn.authenticateJWT(true), users.attachTraining);
  // Retrieve a single User with userId
  app.get(
    "/api/currentUser/:id",
    jwtfn.authenticateJWT(true),
    users.getCurrentUser
  );
  // Update a User with userId
  app.put("/api/users/:id", jwtfn.authenticateJWT(true), users.update);
  // Delete a User with userId
  app.delete("/api/users/:id", jwtfn.authenticateJWT(true), users.delete);
};
