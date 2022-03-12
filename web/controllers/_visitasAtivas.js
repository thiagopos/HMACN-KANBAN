const { getVisitasAtivas } = require("../DB/getVisitasAtivas")

module.exports = app => {

  app.route('/_visitasAtivas')
    .get(async (req, res) => {
      let visitasAtivas = await getVisitasAtivas()      
      res.render('_visitasAtivas.ejs', { data: visitasAtivas , paciente: null })      
    })
}