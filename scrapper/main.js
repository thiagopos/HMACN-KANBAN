
const fs = require('fs')
const readline = require('readline')
const delay = require('delay')
const moment = require('moment')
const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb://localhost:27017'
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
    await delay(18000)

    let data = await scrapper().catch((err) => err)
    let kanban = await formatter(data) 
    
    fs.writeFile('internados.json', JSON.stringify(kanban), (err) => {
      if (err) throw err
      console.log('► Dados mantidos em arquivo...\n' )
    })
    

    
    // Refatorando 
    

    if (kanban !==null) { 
      // Coleta os valores existentes no banco de dados
      let results = await db.collection('pacientes_internados').find().toArray()
      
      let kanbanOLD = []
      let kanbanNEW = []

      results.forEach(p => {        
        kanbanOLD.push(p.prontuario)
      })      

      kanban.forEach(p => {
        kanbanNEW.push(p.prontuario)
      })
      
      //Filtra os valores diferentes entre uma lista e outra
      const pacientes_removidos = kanbanOLD.filter((p) => !kanbanNEW.includes(p))
      
      //Remove os dados de pacientes com alta do banco de dados      
      pacientes_removidos.forEach((p, i) =>  {
        db.collection('pacientes_internados').deleteOne({prontuario: p}, (err, obj) => {
          if (err) throw err;
          console.log("\n Alta: "+ p)  
        });
      })
      
      
      //Realiza o Replace de dados de pacientes com base no RH dos mesmos
      kanban.forEach(p => {
        db.collection('pacientes_internados').replaceOne({prontuario: p.prontuario}, p ,{upsert: true}, (err, res) => {
          if (err) throw err;          
        })
      })
    } else {
      readline.clearLine(process.stdout, 0)
      readline.cursorTo(process.stdout, 0)
      console.log('Navegador foi fechado, reiniciando processo de captura.')
    }
    
    
 
    
/*
   
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
  */
  }
 
})()
