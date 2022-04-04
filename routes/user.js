const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { empAuth } = require("../auth/auth");
const multer = require("multer");

const multerConfig = {
  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, "public/uploads/");
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      //console.log(file);
      const ext = file.mimetype.split("/")[1];
      next(null, +Date.now() + "." + file.originalname);
    },
  }),

  //A means of ensuring only images are uploaded.
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith("image/");
    if (image) {
      console.log("photo uploaded");
      next(null, true);
    } else {
      console.log("file not supported");

      return next();
    }
  },
};

router.post("/", userController.CreateUser);

router.post("/signin", userController.Signin);

router.get("/", empAuth, userController.FindAll);

router.get("/logout", empAuth, userController.Logout);

router.post("/uploadPic", empAuth, multer(multerConfig).single("photo"), userController.UpdatePicture);

router.patch("/changePassword", empAuth, userController.ChangePassword);

router.post("/search", empAuth, userController.Search);

router.get("/:id", userController.FindById);

router.patch("/fname", empAuth, userController.UpdateFname);

router.patch("/lname", empAuth, userController.UpdateLname);

router.patch("/username", empAuth, userController.UpdateUsername);

router.patch("/email", empAuth, userController.UpdateEmail);

router.patch("/role", empAuth, userController.UpdateRole);

router.delete("/:id", empAuth, userController.DeleteUser);

module.exports = router;
