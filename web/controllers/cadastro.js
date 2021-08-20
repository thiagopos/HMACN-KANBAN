const { DateTime } = require("luxon")

module.exports = app => {
    app.route('/cadastro')
    
    .post((req, res) => {       
       let result = req.body
       DateTime.local({zone: 'America/Sao_Paulo'})       
       result.data = DateTime.now()

       db.collection('Visitas').save(result, (err, result) => {
        if (err) return console.log(err)
    
        console.log('Salvo no Banco de Dados')
        res.redirect('/recepcao')
       })
    })
      
}