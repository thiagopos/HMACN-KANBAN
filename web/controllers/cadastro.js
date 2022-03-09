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

            db.collection('imagens').insertOne({imagem: result.imagem}) // insere a imagem no banco
            .then(data_image => {
                result.imagem = data_image.insertedId // insere id da imagem no obj da visita
                db.collection('visitas').insertOne(result)  // insere visita com id de imagem no banco
                .then(data_visita => {
                    db.collection('pacientes_internados').updateOne({registro_hospitalar: data_visita.ops[0].prontuario}, 
                        {$push: { visitas: data_visita.insertedId}}) 
                    console.log(data_visita)                  
                    console.log('Salvo no Banco de Dados')
                    res.redirect('/recepcao')
                })
            })
        })
}