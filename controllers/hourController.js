const { hour: Hour, user: User } = require("../models/index");
const { sequelize } = require("../models/index");

module.exports = {
  CreateHour: async (req, res) => {
    const { hours } = req.body;
    const curDate = new Date().toISOString().split("T")[0];
    try {
      const loggedHours = await Hour.findOne({
        where: {
          userId: req.user.id,
        },
        order: [["createdAt", "DESC"]],
      });
      if (loggedHours && new Date(loggedHours.createdAt.toString()).toISOString().split("T")[0] == curDate) return res.json({ errMsg: "you have already logged your hours for today" });
      const newHour = await Hour.create({
        hours,
        userId: req.user.id,
      });
      res.json(newHour);
    } catch (err) {
      console.log(err);
      res.status(200).json(err);
    }
  },
  GetPendingHours: async (req, res) => {
    try {
      const pendingHours = await Hour.findAll({
        where: { status: "pending" },
        include: [
          {
            model: User,
            attributes: ["fname", "lname", "username", "email"],
          },
        ],
      });
      res.status(200).json(pendingHours);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  GetAllHoursByLoggedinUser: async (req, res) => {
    try {
      const hours = await Hour.findAll({ where: { userId: req.user.id } });
      res.status(200).json(hours);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  GetAllHoursByUser: async (req, res) => {
    const { userId } = req.params;
    try {
      const hours = await Hour.findAll({
        where: { userId },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });
      res.status(200).json(hours);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  GetAllHoursByAllUser: async (req, res) => {
    try {
      const hours = await Hour.findAll({
        where: { status: "approved" },
        attributes: ["userId", [sequelize.fn("sum", sequelize.col("hours")), "sumHour"]],
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
        group: ["user.id", "hour.userId"],
      });
      res.status(200).json(hours);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  ApproveLoggedHours: async (req, res) => {
    const { id } = req.body;
    try {
      await Hour.update({ status: "approved" }, { where: { id } });
      const updated = await Hour.findAll({ where: { status: "pending" } });
      res.status(200).json([...updated]);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  DeleteHour: async (req, res) => {
    const { id } = req.params;
    try {
      await Hour.destroy({
        where: { id },
      });
      res.status(200).json({ msg: "deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
