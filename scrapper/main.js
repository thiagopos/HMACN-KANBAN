
const fs = require('fs')
const readline = require('readline')
const delay = require('delay')
const moment = require('moment')
const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb://smshacn310:27017'
const { scrapper, formatter } = require('./scrapper.js')

moment.locale('pt-br')

MongoClient.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.log(err)
    db = client.db('HMACN_DEV') // coloque o nome do seu DB
  }
);

(async () => {
  let acc = 1
  while (true) {
    let data = await scrapper().catch((err) => err)
    let kanban = await formatter(data) 

    fs.writeFile('internados.json', JSON.stringify(kanban), (err) => {
      if (err) throw err
      console.log('► Dados mantidos em arquivo...')
    })

    if (kanban !== null) {
      db.listCollections({ name: 'pacientes_internados' }).next(
        (err, collinfo) => {
          if (collinfo) {
            db.collection('pacientes_internados').drop((err, result) => {
              if (err) throw err
              console.log('► Remoção de dados antigos...')
            })            
          }

          delay(500)

          db.collection('pacientes_internados').insertMany(
            kanban,
            (err, result) => {
              if (err) throw err
              console.log('► Novos dados persistidos com sucesso!')
              console.log(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ${acc++}`)
            }
          )
        }
      )
    } else {
      readline.clearLine(process.stdout, 0)
      readline.cursorTo(process.stdout, 0)
      console.log('Navegador foi fechado, reiniciando processo de captura.')
    }
    delay(240000)
  }
})()
