require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors')

// Initialise Swagger docs
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const swaggerDoc = yaml.load("./swagger.yaml");
  
app.use(express.json());
app.use(cors());

app.use(
  "/coolerdate/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc)
);

app.get(["/"], function (req, res) {
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
