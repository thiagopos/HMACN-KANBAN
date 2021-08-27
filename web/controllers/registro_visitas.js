const { DateTime } = require("luxon")

module.exports = app => {
  app.route('/registro_visitas')    
  .post((req, res) => {
    db.collection('visitas_passadas')
      .find( { prontuario: req.body.prontuario} )
      .toArray((err, result) => {
        if (err) return console.log(err)

          result.data = DateTime.fromISO(p.data).toLocaleString(DateTime.DATETIME_SHORT)      

          res.render('painel_visitas.ejs', { data: result })
        })   
    
  })
}