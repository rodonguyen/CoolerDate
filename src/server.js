
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3001

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
mongoose.set('strictQuery', true);
const db = mongoose.connection;
db.useDb("coolerdate");
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database\n~~~"));

app.listen(port, () => console.log(`~~~\nServer started. Running in port ${port}.`));



