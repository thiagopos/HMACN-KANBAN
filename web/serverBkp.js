const express = require('express')
const app = express()
const clinicas = require('../SCRAPER/data/clinicas.json')


const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb://smshacn310:27017";

app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err)
  db = client.db('HMACN_DEV')
  app.listen(3000, () => {
    console.log('Server running on port 3000')
  })
})

app.set('view engine', 'ejs')

app.route('/') //setado a rota, e abaixo as ações a serem tomadas dentro desta rota
.get((req, res) => {
  db.collection('pacientes_internados').find().toArray((err, results) => {
    if (err) return console.log(err)
    let clinica = ""
    res.render('show.ejs', { data: results, clinica: clinica })
  })
})

app.route('/:cod')
.get((req, res) => {
  let cod = req.params.cod
  db.collection('pacientes_internados').find({cod: cod}).toArray((err, result) => {
    if (err) return res.send(err)
    let clinica = clinicas.find((c, i) => {
      if(c.codigo === cod)
        return c
    })      
    res.render('show.ejs', { data: result , clinica: clinica})
  })
})
