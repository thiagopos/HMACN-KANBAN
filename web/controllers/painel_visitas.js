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

          res.render('painel_visitas.ejs', { data: results })
        })
    })
    
  }