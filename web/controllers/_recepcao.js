const { DateTime } = require("luxon")
const { getInternados } = require('../DB/getInternados')
const { getPaciente } = require('../DB/getPaciente')
const { getVisitas } = require('../DB/getVisitas')
const { getVisitasAtivas } = require("../DB/getVisitasAtivas")
const { getVisitasAtivasPaciente } = require("../DB/getVisitasAtivasPaciente")
const { getVisitasTotal } = require("../DB/getVisitasTotal")

module.exports = app => {

  app.route('/_recepcao')
    .get(async (req, res) => {      
      res.render('_recepcao.ejs', { data:await getInternados() })      
    })

    .post(async (req, res) => {      
      let paciente = await getPaciente(req.body.id)
      let visitantes = await getVisitas(paciente.visitas)
      let visitantesTotal = await getVisitasTotal(paciente.visitas)

      //posso separar visitas antigas de visitas ativas aqui
      //let visitasAtivas = await getVisitasAtivas()
      
      let visitasAtivasPaciente = await getVisitasAtivasPaciente(visitantesTotal)          
      if( visitasAtivasPaciente !== null) {        
        res.render('_visitasAtivas.ejs', { data: visitasAtivasPaciente , paciente: paciente})
      } else {
        res.render('_cadastro.ejs', { paciente: paciente, visitantes: visitantes})
      }
    })
}