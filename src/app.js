// import express from "express";
const express = require("express");
const app = express();
const parseUrl = require('body-parser')
const path = require('path');

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.get("/hi", function (req, res) {
  res.send("Hello World!");
});



let encodeUrl = parseUrl.urlencoded({ extended: false })

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', "form.html"));
})

app.post('/form', encodeUrl, (req, res) => {
  res.send({'Form request': req.body})
})




// Endpoints to interact with MongoDB 
const coolerDateCodeRouter = require("../routes/coolerDate.code");
app.use("/coolerDate/code", coolerDateCodeRouter);

const coolerDateProfileRouter = require("../routes/coolerDate.profile");
app.use("/coolerDate/profile", coolerDateProfileRouter);

module.exports =  app;    
