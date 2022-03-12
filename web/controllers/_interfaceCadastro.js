const { DateTime } = require("luxon")
const { getInternados } = require('../DB/getInternados')
const { getPaciente } = require('../DB/getPaciente')
const { getVisitas } = require('../DB/getVisitas')
const { getVisitasAtivas } = require("../DB/getVisitasAtivas")
const { getVisitasAtivasPaciente } = require("../DB/getVisitasAtivasPaciente")


module.exports = app => {

  app.route('/_interfaceCadastro')
    .post(async (req, res) => { 
      let paciente = await getPaciente(req.body.paciente)
      let visitantes = await getVisitas(paciente.visitas)      
      //posso separar visitas antigas de visitas ativas aqui
      //let visitasAtivas = await getVisitasAtivas()
      res.render('_cadastro.ejs', { paciente: paciente, visitantes: visitantes})      
    })
}