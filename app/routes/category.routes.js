const jwtfn = require("./../utils/jwtfn.ts");
module.exports = (app) => {
  const categories = require("../controllers/category.controller.js");
  const multer = require("multer");

  const DIR = "./uploads/categories";

  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + "." + file.originalname);
    },
  });
  let upload = multer({ storage: storage });

  // Create a new category
  app.post("/api/categories", jwtfn.authenticateJWT(true), categories.create);

  // Retrieve all categories
  app.get("/api/categories", jwtfn.authenticateJWT(false), categories.findAll);

  // Retrieve a single category with categoryId
  app.get(
    "/api/categories/:id",
    jwtfn.authenticateJWT(false),
    categories.findOne
  );

  // Update a category with categoryId
  app.put(
    "/api/categories/:id",
    jwtfn.authenticateJWT(true),
    categories.update
  );

  // Delete a category with categoryId
  app.delete(
    "/api/categories/:id",
    jwtfn.authenticateJWT(true),
    jwtfn.minimumPermissionLevelRequired("Api_categories", "delete"),
    categories.delete
  );

  // Upload
  app.post("/api/categories/upload", upload.single("photo"), categories.upload);
};
