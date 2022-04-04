const express = require("express");
const path = require("path");
const auth = require("../auth/auth.js");
const ejs = require("ejs");
const pdf = require("html-pdf");
const router = express.Router();
const { user: User, hour: Hour } = require("../models/index");

router.get("/:id", auth.manAuth, async (req, res) => {
  const hours = await Hour.findAll({
    where: { userId: req.params.id },
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  });

  let total = 0;
  hours.forEach((h) => (total += h.hours));

  ejs.renderFile(path.join(__dirname, "../views/", "pdf.ejs"), { hours, total }, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      pdf.create(data).toFile("report.pdf", function (err, data) {
        if (err) {
          res.send(err);
        } else {
          res.sendFile(path.join(__dirname, "../report.pdf"));
        }
      });
    }
  });
});

module.exports = router;
