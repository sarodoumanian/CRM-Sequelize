const express = require("express");
const hourController = require("../controllers/hourController");
const router = express.Router();
const { empAuth } = require("../auth/auth");

router.post("/", empAuth, hourController.CreateHour);

router.get("/", empAuth, hourController.GetAllHoursByLoggedinUser);

router.get("/pending", empAuth, hourController.GetPendingHours);

router.get("/allHours", empAuth, hourController.GetAllHoursByAllUser);

router.get("/:userId", empAuth, hourController.GetAllHoursByUser);

router.delete("/:id", empAuth, hourController.DeleteHour);

router.patch("/", empAuth, hourController.ApproveLoggedHours);

module.exports = router;
