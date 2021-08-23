const { DateTime } = require("luxon")

module.exports = app => {
    app.route('/visitas')
    .get((req, res) => {
      db.collection('visitas')
        .find()
        .toArray((err, results) => {
          if (err) return console.log(err)          
          let total = results.length          

          //Algoritmo para retornar diferença em horas
          const listaVisitantes = filtroVisitantes(results)

          listaVisitantes.forEach( v => {
            db.collection('visitas').findOneAndDelete({prontuario: v.prontuario},  (err,doc) => {
              if (err) return console.log("Nenhum visitante ativo.")
              if(doc){
                  db.collection('visitas_passadas').insertOne(doc.value , (err, result1) => {
                      if (err) return console.log(err)      
                      console.log('Salvo no Banco de Dados' + v.nome)          
                  })
              }
            });
          })
          

          
          

          results.sort((a,b) => {
            return a.visitante < b.visitante ? -1 : a.visitante > b.visitante ? 1 : 0;
          });

          res.render('visitas.ejs', { data: results, total: total })
        })
    })
    
    .post((req, res) => {
      let result = req.body      
      result.saida = DateTime.now().setZone('America/Recife').toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
      
      result.entrada = formataData(result.entrada)
      result.saida = formataData(result.saida)


      res.render('comprovante', { data: result})
    })
}

const formataData = (dataStr) => {
  let arr = dataStr.split(' ')
  arr.pop()
  let hora = arr.pop()
  let data = arr.join(' ')
  return data + " às " + hora.substring(0, hora.length-3)
}

const filtroVisitantes = (lista) => {
  const newList = lista.filter(v => {
    if(!tempoDiff(v.data)) 
      return v
  })
  return newList
}

const tempoDiff = (dataVisita) => {
  //obj = {dia, hora, minuto}
  const limiteMinutos = 120
  const entrada = parseDate(dataVisita)
  const agora = parseDate(DateTime.now().setZone('America/Recife').toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS))

  if(entrada.dia === agora.dia){
    if(entrada.hora === agora.hora){
      if((agora.hora - entrada.hora) <= limiteMinutos)
        return true
      else 
        return false
    } else {
      let horas_diff = (agora.hora - entrada.hora) * 60
      let min_diff = Math.abs(entrada.minutos - agora.minutos)      
      if(entrada.minutos <= agora.minutos) {
        if((horas_diff + min_diff) <= limiteMinutos)
          return true
        else
          return false
      } else {
        if((horas_diff - min_diff) <= limiteMinutos)
          return true
        else
          return false
      }
    }
  } else {
    // Altamente experimental
    if(agora.dia - entrada.dia > 1) return false
    if(entrada.dia < 22) return false
    if(agora.hora > 1) return false
    if(entrada.dia === 22 && entrada.minuto === 0) return false    
  }
  return true
}

const parseDate = (dataString) => {
  // exemplo: 21 de agosto de 2021 4:15:08 BRT  
  const dataArray = dataString.split(/ |:/)  
  return { 
    dia: Number(dataArray[0]), 
    hora: Number(dataArray[5]), 
    minuto: Number(dataArray[6]),
  }  
}