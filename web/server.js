const express = require('express')
const app = express()
const clinicas = require('../SCRAPPER/data/clinicas.json')
const moment = require('moment')
const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb://localhost:27017'
const consign = require('consign')


app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

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

app.set('view engine', 'ejs')

// daqui pra baixo só tem remendo, refatorar pelo amor de deus!
app.route('/thais').get((req, res) => {
  let cod = 'ORT'
  db.collection('pacientes_internados')
    .find({ esp: cod })
    .toArray((err, result) => {
      if (err) return res.send(err)
      result.forEach((p) => {
        let cfinded = clinicas.find((c) => c.codigo === p.cod)
        p.nClin = cfinded.clinica
      })
      let total = result.length
      formatarDados(result)
      res.render('thais.ejs', {
        data: result,
        clinicas: clinicas,
        total: total,
      })
    })
})

const formatarDados = (pacientes) => {
  pacientes.forEach((p, i) => {
    let dias = p.status.split('D').shift()
    if (Number(dias) >= Number(7)) p.alert = true
    else p.alert = false
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
      if (total <= 10) return pacientes
      const paginas = Math.ceil(total / 10)
      const time = Number(inMinutes())
      const pagNum = (time % paginas) * 10
      let pagExibir = []
      if (pagNum + 10 <= total) {
        pagExibir = pacientes.slice(pagNum, pagNum + 10)
      } else {
        pagExibir = pacientes.slice(pagNum, total)
      }
      return pagExibir
    }
    
    const clinicaSTR = (cod) => {
      return clinicas.find((c, i) => {
        if (c.codigo === cod) return c
      })
    }
    
    const inMinutes = () => {
      let horasMin = moment().format('hh:mm')
      let vetorHorasMin = horasMin.split(':')
      return Number(vetorHorasMin[0]) * 60 + Number(vetorHorasMin[1])
    }
    
    
})
