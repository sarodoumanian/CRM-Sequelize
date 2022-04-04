const { user: User } = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  CreateUser: async (req, res) => {
    const { fname, lname, username, email, password, role, gender, date_of_birth } = req.body;
    try {
      const hashed = await bcrypt.hash(password, 8);
      const newUser = await User.create({
        fname,
        lname,
        username,
        email,
        password: hashed,
        role,
        gender,
        date_of_birth,
      });
      res.json(newUser);
    } catch (error) {
      console.log(error);
    }
  },
  FindAll: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  },
  FindById: async (req, res) => {
    try {
      if (req.params.id.length < 36) return;
      const user = await User.findOne({ where: { id: req.params.id } });
      res.json(user);
    } catch (error) {
      console.log(error);
    }
  },
  Signin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) return res.json({ errMsg: "username or password is incorrect" }).status(401);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.json({ errMsg: "username or password is incorrect" }).status(401);
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "5h" });
      res
        .cookie("token", token, { maxAge: 5 * 60 * 60 * 1000, httpOnly: true })
        .cookie("user_id", user.id, { maxAge: 5 * 60 * 60 * 1000 })
        .status(200)
        .json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  ChangePassword: async (req, res) => {
    const { id, oldPassword, newPassword, confirmPassword } = req.body;
    try {
      const user = await User.findOne({ where: { id } });
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.json({ Msg: "Old password is incorrect" });
      if (newPassword !== confirmPassword) return res.json({ Msg: "new password and confirm password should be the same" });
      const hashed = await bcrypt.hash(newPassword, 8);

      await User.update({ password: hashed }, { where: { id: req.user.id } });
      res.status(200).json({ Msg: "password changed" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  UpdatePicture: async (req, res) => {
    try {
      if (!req.file) return;
      await User.update({ profie_pic: req.file.filename }, { where: { id: req.user.id } });
      res.status(200);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  Search: async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
          [Op.or]: [
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("fname")), "LIKE", `${req.body.search}%`),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("lname")), "LIKE", `${req.body.search}%`),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("username")), "LIKE", `${req.body.search}%`),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("email")), "LIKE", `${req.body.search}%`),
          ],
        },
      });
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  UpdateFname: async (req, res) => {
    const { id, fname } = req.body;
    if (!fname) return;
    try {
      await User.update({ fname }, { where: { id } });
      res.status(200).json("updated");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  UpdateLname: async (req, res) => {
    const { id, lname } = req.body;
    if (!lname) return;
    try {
      await User.update({ lname }, { where: { id } });

      res.status(200).json("updated");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  UpdateUsername: async (req, res) => {
    const { id, username } = req.body;
    if (!username) return;
    try {
      await User.update({ username }, { where: { id } });

      res.status(200).json("updated");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  UpdateEmail: async (req, res) => {
    const { id, email } = req.body;
    if (!email) return;
    try {
      await User.update({ email }, { where: { id } });

      res.status(200).json("updated");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  UpdateRole: async (req, res) => {
    const { id, role } = req.body;
    if (!role) return;
    try {
      await User.update({ role }, { where: { id } });

      res.status(200).json("updated");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  Logout: (req, res) => {
    res.clearCookie("token").clearCookie("user_id").json("logged out");
  },
  DeleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      await User.destroy({
        where: { id },
      });
      res.status(200).json("user deleted");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
