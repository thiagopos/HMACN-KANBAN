const { DateTime } = require("luxon")

module.exports = app => {
    app.route('/painel_visitas')
    .get((req, res) => {
      db.collection('visitas_passadas')
        .find()
        .toArray((err, results) => {
          if (err) return console.log(err)       

          results.sort((a,b) => {
            return a.visitante < b.visitante ? -1 : a.visitante > b.visitante ? 1 : 0;
          });

          results.forEach(p => {
            p.data = DateTime.fromISO(p.data).toLocaleString(DateTime.DATETIME_SHORT)
          })

          res.render('painel_visitas.ejs', { data: results })
        })
    })
    
  }