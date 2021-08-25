const { DateTime } = require("luxon")

module.exports = app => {
    app.route('/painel_visitas')
    .get((req, res) => {      
      
      res.render('painel_visitas.ejs', { data : null})
    })
    .post((req, res) => { 
      let pesquisa = req.body.pesquisa      
      console.log(pesquisa)

      // Aqui estou limitando em 20
      // Vou optar por não fazer a paginação agora
      // mas pra fazer eu preciso manter o valor pesquisado
      // a pesquisa também deverá ocorrer pelo nome do acompanhante
      // e pelo rh do paciente..
      // mas por hora isso demandaria muito tempo e tem funcões 
      // mais importantes no momento.
      
      db.collection('visitas_passadas')
        .find( { nome: new RegExp(pesquisa, 'i')} ).limit( 30 )
        .toArray((err, results) => {
          if (err) return console.log(err)       

          results.sort((a,b) => {
            return a.visitante < b.visitante ? -1 : a.visitante > b.visitante ? 1 : 0;
          });

          results.forEach(p => {
            p.data = DateTime.fromISO(p.data).toLocaleString(DateTime.DATETIME_SHORT)
          })          

          res.render('painel_visitas.ejs', { data: results })
        })
        
    })
  }