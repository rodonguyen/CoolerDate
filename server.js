require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = process.env.DATABASE_URL;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('Connected to Database');
  
//   // perform actions on the collection object

//   client.close();
// });

app.use(express.json())

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.useDb('coolerdate')
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


app.get('/hi', function() {
  res.send('Hello World!')
})

const coolerDateRouter = require('./routes/coolerDate')
app.use('/coolerDate', coolerDateRouter)

app.listen(3001, () => console.log('Server Started'))     