const { DateTime } = require("luxon")

module.exports = app => {
  app.route('/painel_visitas')
    .get((req, res) => {

      res.render('painel_visitas.ejs', {
        data: null
      })
    })
    .post((req, res) => {
      let pesquisa = req.body.pesquisa
      console.log(pesquisa)

      // FAREMOS A PAGINAÇÃO HOJE!!!!

      db.collection('visitas_passadas')
        .find({
          $or:[{ documento: new RegExp(pesquisa, 'i') },
          { prontuario: new RegExp(pesquisa, 'i') },
          { nome: new RegExp(pesquisa, 'i') },
          { dt: new RegExp(pesquisa, 'i') },
          { visitante: new RegExp(pesquisa, 'i') }]
        }).limit(30)
        .toArray((err, results) => {
          if (err) return console.log(err)

          results.sort((a, b) => {
            return a.visitante < b.visitante ? -1 : a.visitante > b.visitante ? 1 : 0;
          });

          results.forEach(p => {
            p.data = DateTime.fromISO(p.data).toLocaleString(DateTime.DATETIME_SHORT)
          })

          res.render('painel_visitas.ejs', {
            data: results
          })
        })

    })
}