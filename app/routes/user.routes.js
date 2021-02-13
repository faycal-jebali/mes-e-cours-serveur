const users = require("../controllers/user.controller.js");
const jwtfn = require("../utils/jwtfn.ts");
module.exports = (app) => {
  // Create a new User
  app.post("/api/users", jwtfn.authenticateJWT, users.create);
  // Retrieve all Users
  app.get("/api/users", jwtfn.authenticateJWT, users.findAll);
  // Retrieve a single User with userId
  app.get("/api/users/:id", jwtfn.authenticateJWT, users.findOne);
  // Attach Training to User
  app.put("/api/attach", jwtfn.authenticateJWT, users.attachTraining);
  // Retrieve a single User with userId
  app.get("/api/currentUser/:id", jwtfn.authenticateJWT, users.getCurrentUser);
  // Update a User with userId
  app.put("/api/users/:id", jwtfn.authenticateJWT, users.update);
  // Delete a User with userId
  app.delete("/api/users/:id", jwtfn.authenticateJWT, users.delete);
};
