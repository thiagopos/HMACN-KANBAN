const { DateTime } = require("luxon")

module.exports = app => {
    app.route('/cadastro')

        .post((req, res) => {
            let result = req.body
            
            result.data = DateTime.now().setZone('America/Recife').toISO()

            db.collection('visitas').findOneAndDelete({
                prontuario: result.prontuario
            }, (err, doc) => {
                if (err) return console.log("Nenhum visitante ativo.")
                if (doc) {
                    db.collection('visitas_passadas').insertOne(doc.value, err => {
                        if (err) return console.log(err)
                        console.log('Salvo no Banco de Dados' + result.nome)
                    })
                }
            });

            db.collection('visitas').insertOne(result, err => {
                if (err) return console.log(err)
                console.log('Salvo no Banco de Dados')
                res.redirect('/recepcao')
            })
        })

}