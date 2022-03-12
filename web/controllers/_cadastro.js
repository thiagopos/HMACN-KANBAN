const { DateTime } = require("luxon")
const { setVisita } = require("../DB/setVisita")

module.exports = app => {
    app.route('/_cadastro')
        .get((req, res) => {            
            res.redirect('/_recepcao')
        })

        .post((req, res) => {
            let result = req.body

            result.data = DateTime.now().setZone('America/Recife').toJSDate()

            //VOU CHAMAR O SETVISITA AQUI
            setVisita(result)

            console.log('Salvo no Banco de Dados')
            res.redirect('/_recepcao')
        })
}