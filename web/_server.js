const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb://smshacn310:27017'
const consign = require('consign')
const PORT = 3000;
app.use(express.static(__dirname + '/public'))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.set('view engine', 'ejs')

consign().include('controllers').into(app)

app.listen(PORT, () => {
  console.log(`Servidor de pé na porta ${PORT}`)
})

