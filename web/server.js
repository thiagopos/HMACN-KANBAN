const express = require('express')
const app = express()
const clinicas = require('../SCRAPPER/data/clinicas.json')
const moment = require('moment')
const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb://smshacn310:27017'

app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))



MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err)
  db = client.db('HMACN_DEV')
  app.listen(80, () => {
    console.log('Server running!')
  })
})

app.set('view engine', 'ejs')

app
  .route('/') //setado a rota, e abaixo as ações a serem tomadas dentro desta rota
  .get((req, res) => {
    db.collection('pacientes_internados')
      .find()
      .toArray((err, results) => {
        if (err) return console.log(err)
        let clinica = ''
        res.render('show.ejs', { data: results, clinica: clinica })
      })
  })

  //um remendo só pra thais conseguir concluir um serviço
  //Com esse belo remendo descobri que posso tratar o result para tratar melhor os dados no front!
  app.route('/thais')
  .get((req, res) => {
    let cod = "ORT"
    db.collection('pacientes_internados').find({esp: cod}).toArray((err, result) => {
      if (err) return res.send(err)
      result.forEach(p => {
        let cfinded = clinicas.find(c => c.codigo === p.cod)
        p.nClin = cfinded.clinica
      })
      let total = result.length
      formatarDados(result)
      res.render('thais.ejs', { data: result , clinicas: clinicas, total: total})
    })
  })

  const formatarDados = pacientes => {
    pacientes.forEach((p, i) => {
      let dias = p.status.split('D').shift()        
      if (Number(dias) >= Number(7))
        p.alert = true
      else
        p.alert = false       
    })
  }

app.route('/:cod').get((req, res) => {
  let cod = req.params.cod
  db.collection('pacientes_internados')
    .find({ cod: cod })
    .toArray((err, result) => {
      if (err) return res.send(err)
      let clinica = clinicaSTR(cod)
      formatarDados(result)
      let showData = criaPaginas(result)
      res.render('show.ejs', { data: showData, clinica: clinica })
    })

  const criaPaginas = (pacientes) => {
    const total = pacientes.length
    if(total <= 10)
      return pacientes
    const paginas = Math.ceil(total/10)
    const time = Number(inMinutes())
    const pagNum = (time%paginas) * 10
    let pagExibir = []
    if((pagNum+10)<=total){
      pagExibir = pacientes.slice(pagNum, pagNum+10)
    } else {
      pagExibir = pacientes.slice(pagNum, total)
    }
    return pagExibir
  }

  const clinicaSTR = cod => {
    return clinicas.find((c, i) => {
      if (c.codigo === cod) 
      return c
    })
  }

  const inMinutes = () => {    
    let horasMin = moment().format('hh:mm')
    let vetorHorasMin = horasMin.split(':')     
    return Number(vetorHorasMin[0]) * 60 + Number(vetorHorasMin[1])
  }

  
})
