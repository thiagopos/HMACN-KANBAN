const { DateTime } = require("luxon")

module.exports = app => {
    app.route('/cadastro')
        .get((req, res) => {
            res.redirect('/recepcao')
        })

        .post((req, res) => {
            let result = req.body
            
            result.data = DateTime.now().setZone('America/Recife').toISO()
            result.dt = DateTime.now().setZone('America/Recife').toLocaleString(DateTime.DATETIME)            

            db.collection('visitas').insertOne(result, err => {
                if (err) return console.log(err)
                console.log('Salvo no Banco de Dados')
                res.redirect('/recepcao')
            })
        })

}