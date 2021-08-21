const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb://localhost:27017'
const consign = require('consign')

app.use(express.static(__dirname + '/public'))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.set('view engine', 'ejs')


consign().include('controllers').into(app)

MongoClient.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.log(err)
    db = client.db('HMACN_DEV')
    app.listen(80, () => {
      console.log('Server running!')
    })
  }
)