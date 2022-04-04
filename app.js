require("dotenv").config();
const express = require("express");
const CookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "PATCH", "HEAD", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(CookieParser());
app.use(express.static("public"));

const { userRouter, hourRouter, pdfRouter } = require("./routes/index");
app.use("/api/user", userRouter);
app.use("/api/hour", hourRouter);
app.use("/api/pdf", pdfRouter);

app.listen(process.env.PORT, () => console.log("server started"));
