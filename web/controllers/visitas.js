const { DateTime } = require("luxon")

const filtroVisitas = require('../utils/visitasAtivas')

module.exports = app => {
  app.route('/visitas')
    .get((req, res) => {
      db.collection('visitas')
        .find()
        .toArray((err, results) => {
          if (err) return console.log(err)

          if (results.length !== 0) {
            let filtrados = filtroVisitas(results)

            filtrados.sort((a, b) => {
              return a.visitante < b.visitante ? -1 : a.visitante > b.visitante ? 1 : 0;
            })

            filtrados.forEach(p => {
              p.data = DateTime.fromISO(p.data).toLocaleString(DateTime.DATETIME_SHORT)
            })

            res.render('visitas.ejs', {
              data: filtrados
            })
          }

          res.render('visitas.ejs', {
            data: results
          })


        })


    })

    .post((req, res) => {
      let result = req.body
      result.saida = DateTime.now().setZone('America/Recife').toLocaleString(DateTime.DATETIME_SHORT)

      result.entrada = formataData(result.entrada)
      result.saida = formataData(result.saida)


      res.render('comprovante', {
        data: result
      })
    })
}

const formataData = date => {
  let arr = date.split(' ')
  let aux = arr.pop()
  arr.push(' às ')
  aux = arr[0] + arr[1] + aux
  return aux
}
/*
const filtroVisitantes = (lista) => {
  
  const tmp_max = 120 // Tempo de duração maxima da visita ativa no painel.
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
*/