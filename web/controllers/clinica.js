module.exports = app => {
  app.route('/')
  .get((req, res) => {
    db.collection('pacientes_internados')
      .find()
      .toArray((err, results) => {
        if (err) return console.log(err)
        let clinica = ''
        res.render('show.ejs', { data: results, clinica: clinica })
      })
  })
}