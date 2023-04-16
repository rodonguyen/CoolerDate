// import express from "express";
require("dotenv").config();
const express = require("express");
const app = express();
const parseUrl = require('body-parser')
const path = require('path');
const cors = require('cors')
const swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

app.use(express.json());
app.use(cors())

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API Documentation with Swagger",
      version: "0.1.0",
      description:
        "CoolerDate Database",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Rodo",
        url: "rodonguyen.dev",
        email: "rodonguyendd@gmail.com",
      },
    },
    servers: [
      {url: "http://localhost:3001"},
      {url: process.env.SERVER_URL}
    ],
  },
  apis: ["./routes/*.js"],
};


const specs = swaggerJsdoc(options);
app.use(
  "/coolerdate/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);


app.get(["/", "/hi"], function (req, res) {
  res.send("Hello World!");
});




// // Form use to add code from server (paused)
// let encodeUrl = parseUrl.urlencoded({ extended: false })

// app.get('/form', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', "form.html"));
// })

// app.post('/form', encodeUrl, (req, res) => {
//   res.send({'Form request': req.body})
// })



// Endpoints to interact with MongoDB 
const coolerDateCodeRouter = require("../routes/coolerDate.code");
const coolerDateProfileRouter = require("../routes/coolerDate.profile");
const coolerDateRespondentRouter = require("../routes/coolerDate.respondent");

app.use("/coolerDate/code", coolerDateCodeRouter);
app.use("/coolerDate/profile", coolerDateProfileRouter);
app.use("/coolerDate/respondent", coolerDateRespondentRouter);

module.exports =  app;
