module.exports = app => {
    app.route('/recepcao')
    .get((req, res) => {
      db.collection('pacientes_internados')
        .find()
        .toArray((err, results) => {
          if (err) return console.log(err)          
          let total = results.length
          
          results.sort((a,b) => {
            return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
          });

          res.render('recepcao.ejs', { data: results, total: total })
        })
    })
    
    .post((req, res) => {      
      res.render('cadastro.ejs', { data: req.body})
    })
}