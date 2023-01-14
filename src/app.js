// import express from "express";
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.get("/hi", function (req, res) {
  res.send("Hello World!");
});

const coolerDateCodeRouter = require("../routes/coolerDate.code");
app.use("/coolerDate/code", coolerDateCodeRouter);

const coolerDateProfileRouter = require("../routes/coolerDate.profile");
app.use("/coolerDate/profile", coolerDateProfileRouter);

module.exports =  app;    
