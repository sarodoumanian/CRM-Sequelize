const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { empAuth, manAuth } = require("../auth/auth");
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

router.post("/", manAuth, userController.CreateUser);

router.post("/signin", userController.Signin);

router.get("/", manAuth, userController.FindAll);

router.get("/logout", empAuth, userController.Logout);

router.post("/uploadPic", empAuth, multer(multerConfig).single("photo"), userController.UpdatePicture);

router.patch("/changePassword", empAuth, userController.ChangePassword);

router.post("/search", manAuth, userController.Search);

router.get("/:id", empAuth, userController.FindById);

router.patch("/fname", manAuth, userController.UpdateFname);

router.patch("/lname", manAuth, userController.UpdateLname);

router.patch("/username", manAuth, userController.UpdateUsername);

router.patch("/email", manAuth, userController.UpdateEmail);

router.patch("/role", manAuth, userController.UpdateRole);

router.delete("/:id", manAuth, userController.DeleteUser);

module.exports = router;
