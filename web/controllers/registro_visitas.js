const { DateTime } = require("luxon")

module.exports = app => {

  app.route('/registro_visitas')
    .post((req, res) => {
    let visita_ativa = req.body
      
    if(visita_ativa.encerrar !== '') { 

      db.collection('visitas').findOneAndDelete({ prontuario: visita_ativa.prontuario }, (err, doc) => {
        if (err) return console.log("Nenhum visitante ativo.")
        if (doc) {
          db.collection('visitas_passadas').insertOne(doc.value, err => {
            if (err) return console.log(err)
            console.log('Salvo no Banco de Dados')
          })
        }
      })
      res.redirect('/recepcao')      
    } else {
      visita_ativa.saida = DateTime.now().setZone('America/Recife').toLocaleString(DateTime.DATETIME_SHORT)
      visita_ativa.entrada = formataData(visita_ativa.entrada)
      visita_ativa.saida = formataData(visita_ativa.saida)
      res.render('comprovante', { data: visita_ativa } ) 
    }
  })
}

const formataData = date => {
  let arr = date.split(' ')
  let aux = arr.pop()
  arr.push(' às ')
  aux = arr[0] + arr[1] + aux
  return aux
}