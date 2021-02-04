const jwtfn = require("./../utils/jwtfn.ts");
module.exports = (app) => {
  const courses = require("../controllers/course.controller.js");
  const multer = require("multer");

  const DIR = "./uploads/courses";

  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      console.log("req :: ", req.alias);
      cb(null, file.fieldname + "-" + Date.now() + "." + file.originalname);
      // cb(null, Date.now() + '.mp4');
    },
  });
  let upload = multer({ storage: storage });

  // Create a new Course
  app.post("/api/courses", jwtfn.authenticateJWT, courses.create);

  // Retrieve all courses
  app.get("/api/courses", jwtfn.authenticateJWT, courses.findAll);

  // Retrieve a single Course with id
  app.get("/api/courses/:id", jwtfn.authenticateJWT, courses.findOne);

  // Update a Course with id
  app.put("/api/courses/:id", jwtfn.authenticateJWT, courses.update);

  // Delete a Course with id
  app.delete("/api/courses/:id", jwtfn.authenticateJWT, courses.delete);

  // Upload
  // app.post('/api/courses/upload', upload.single('uploaded'), courses.upload);
};
