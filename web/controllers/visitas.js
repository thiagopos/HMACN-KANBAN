const { DateTime } = require("luxon")

module.exports = app => {
    app.route('/visitas')
    .get((req, res) => {
      db.collection('visitas')
        .find()
        .toArray((err, results) => {
          if (err) return console.log(err)          
          let total = results.length          

          //Algoritmo que retorna a lista de visitas ativas.
          if(results.length !== 0){ 
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

            
          }
          

          results.sort((a,b) => {
            return a.visitante < b.visitante ? -1 : a.visitante > b.visitante ? 1 : 0;
          });

          results.forEach(p => {
            p.data = DateTime.fromISO(p.data).toLocaleString(DateTime.DATETIME_SHORT)
          })

          res.render('visitas.ejs', { data: results, total: total })
        })
    })
    
    .post((req, res) => {
      let result = req.body   
      result.saida = DateTime.now().setZone('America/Recife').toLocaleString(DateTime.DATETIME_SHORT)
      
      result.entrada = formataData(result.entrada)
      result.saida = formataData(result.saida)


      res.render('comprovante', { data: result})
    })
}

const formataData = date => {
  //24/08/2021 18:17
  let arr = date.split(' ')
  let aux = arr.pop()
  arr.push(' às ')
  aux = arr[0] + arr[1] + aux
  return aux
}

const filtroVisitantes = (lista) => {
  
  const tmp_max = 10 // tempo de duração da visita ativa em minutos
  const newList = lista.filter(v => {
    let now = DateTime.now().setZone('America/Recife').toISO()
    let d1 = DateTime.fromISO(v.data)
    let d2 = DateTime.fromISO(now)
    
    let diff = d1.diff(d2, ["minutes"])
    diff = diff.toObject()
        
    if(Math.abs(diff.minutes) < tmp_max)
      return false
    return true

  })  
  
  return newList
}
