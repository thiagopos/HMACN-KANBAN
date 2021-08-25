
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
      pacientes_removidos.forEach( p =>  {
        db.collection('pacientes_internados').deleteOne({prontuario: p}, err => {
          if (err) throw err;
          console.log('\nRemovido da lista: ' + p)  
        });
      })
      
      
      //Realiza o Replace de dados de pacientes com base no RH dos mesmos
      kanban.forEach(p => {
        db.collection('pacientes_internados').replaceOne({prontuario: p.prontuario}, p ,{upsert: true}, (err, res) => {
          if (err) throw err;
          console.log('\nPacientes atualizados.')          
        })
      })
    } else {
      readline.clearLine(process.stdout, 0)
      readline.cursorTo(process.stdout, 0)
      console.log('Navegador foi fechado, reiniciando processo de captura.')
    } 

  }
 
})()
