const { DateTime } = require("luxon")
const filtroVisitas = require('../utils/visitasAtivas')

module.exports = app => {
  app.route('/recepcao')
    .get((req, res) => {
      db.collection('pacientes_internados')
        .find()
        .toArray((err, internados) => {
          if (err) return console.log(err)
          db.collection('visitas')
            .find()
            .toArray((err, visitas) => {
              if (err) return console.log(err)
              if (visitas.length !== 0) { 
                internados.sort((a, b) => {
                  return a.nome_paciente < b.nome_paciente ? -1 : a.nome_paciente > b.nome_paciente ? 1 : 0;
                });
                res.render('recepcao.ejs', {
                  data: internados
                })
              } else {
                internados.sort((a, b) => {
                  return a.nome_paciente < b.nome_paciente ? -1 : a.nome_paciente > b.nome_paciente ? 1 : 0;
                });
                res.render('recepcao.ejs', { data: internados })
              }
            })
        })
    })

    .post((req, res) => {
      if (req.body.visita_ativa !== "") { 
        db.collection('visitas')
          .find({
            prontuario: req.body.prontuario
          })
          .toArray((err, doc) => {
            
            doc[0].data = DateTime.fromISO(doc[0].data).toLocaleString(DateTime.DATETIME_SHORT)      
            res.render('registro_visitas', {
              data: doc[0]
            })
          })
      } else {
        res.render('cadastro.ejs', {
          data: req.body
        })
      }
    })
}