
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 8080

// import dotenv from "dotenv";
// import  { mongoose } from "mongoose";
// import { app } from "./app";


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = process.env.DATABASE_URL;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('Connected to Database');
//   // perform actions on the collection object
//   client.close();
// });

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.useDb("coolerdate");
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.listen(port, () => console.log("Server Started"));
