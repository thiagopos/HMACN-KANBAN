const { DateTime } = require("luxon")
const { getPaciente } = require("../DB/getPaciente")
const { getVisita } = require("../DB/getVisita")

module.exports = async app => {
    app.route('/_comprovante')
        .get(async (req, res) => {
            res.redirect('/_recepcao')
        })

        .post(async (req, res) => {            
            let visitante = await getVisita(req.body.visitante)
            let paciente = await getPaciente(visitante.paciente)            
            res.render('_comprovante.ejs', { visitante: visitante, paciente: paciente })
        })
}