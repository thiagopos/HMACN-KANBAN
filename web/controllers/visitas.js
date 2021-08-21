const { DateTime } = require("luxon")

module.exports = app => {
    app.route('/visitas')
    .get((req, res) => {
      db.collection('visitas')
        .find()
        .toArray((err, results) => {
          if (err) return console.log(err)          
          let total = results.length
          
          results.sort((a,b) => {
            return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
          });

          res.render('visitas.ejs', { data: results, total: total })
        })
    })
    
    .post((req, res) => {
      let result = req.body
      console.log(result)
      result.saida = DateTime.now().setZone('America/Recife').toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
      res.render('comprovante', { data: result})
    })
}