const FormationModel = require("../models/course.model.js");
const fs = require("fs");
// Create and Save a new Course
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Course content can not be empty",
    });
  }
  console.log("req course :: ", req.body);
  const courseData = {
    trainer: req.body.trainer,
    statut: req.body.statut,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    promotionPrice: req.body.promotionPrice,
    categoriesId: req.body.categoriesId,
    chapiters: req.body.chapiters,
    // buttonText: 'Button',
    img: req.body.image,
  };
  // Create a Course
  const course = new FormationModel(courseData);

  // Save Course in the database
  course
    .save()
    .then((data) => {
      res.send({
        success: true,
        message: "Course created successfully!",
        data: { id: data._id },
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while creating the course.",
      });
    });
};

// Retrieve and return all courses from the database.
exports.findAll = (req, res) => {
  const { Role } = req.user;
  console.log("req.user :: ", req.user);
  console.log("role:: ", Role);
  let authorized;
  if (Role && !Role.includes("admin")) {
    authorized = false;
    // return res.sendStatus(403);
  } else {
    authorized = true;
  }
  FormationModel.find()
    .then((courses) => {
      // Restrict display product for no authorized
      if (!authorized) {
        courses.map((item) => (item.chapiters = []));
      }
      console.log("courses  :: ", courses);
      res.send(courses);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while retrieving courses.",
      });
    });
};

// Find a single course with a id
exports.findOne = (req, res) => {
  const idCourse = req.params.id;
  FormationModel.findById(idCourse)
    .then((course) => {
      if (!course) {
        return res.status(404).send({
          success: false,
          message: "course not found with id " + idCourse,
        });
      }
      res.send(course);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "course not found with id " + idCourse,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving course with id " + idCourse,
      });
    });
};

// Update a course identified by the ID in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "course content can not be empty",
    });
  }
  const idCourse = req.params.id;
  const courseData = {
    trainer: req.body.trainer,
    statut: req.body.statut,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    promotionPrice: req.body.promotionPrice,
    categoriesId: req.body.categoriesId,
    chapiters: req.body.chapiters,
    img: req.body.image,
  };
  // courseData.img1.data = fs.readFileSync(req.body.image);
  // courseData.img1.contentType = 'jpg';
  // Find course and update it with the request body
  FormationModel.findByIdAndUpdate(idCourse, courseData, { new: true })
    .then((course) => {
      if (!course) {
        return res.status(404).send({
          success: false,
          message: "course not found with id " + idCourse,
        });
      }
      res.send({
        success: true,
        message: "Course updated successfully!",
        data: { id: idCourse },
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "course not found with id " + idCourse,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating course with id " + idCourse,
      });
    });
};

// Delete a course with the specified id in the request
exports.delete = (req, res) => {
  const idCourse = req.params.id;
  FormationModel.findByIdAndRemove(idCourse)
    .then((course) => {
      if (!course) {
        return res.status(404).send({
          success: false,
          message: "Course not found with id " + idCourse,
        });
      }
      res.send({
        success: true,
        message: "Course deleted successfully!",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "Course not found with id " + idCourse,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not delete Course with id " + idCourse,
      });
    });
};

exports.B = (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false,
    });
  } else {
    console.log("file received successfully");
    return res.send({
      success: true,
    });
  }
};
