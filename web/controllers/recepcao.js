const filtroVisitas = require('../utils/visitasAtivas')

module.exports = app => {
    app.route('/recepcao')
    .get((req, res) => {
      db.collection('pacientes_internados')
        .find()
        .toArray((err, internados) => {
          if (err) return console.log(err)          
          db.collection('visitas')
          .find()
          .toArray((err, visitas) => {
            if (err) return console.log(err)  
            if(visitas.length !== 0){
              let comVisita = filtroVisitas(visitas)          
               
              if(comVisita.length !== 0){      
                comVisita.forEach( cv => {
                  internados.forEach( i => {
                    if(cv.prontuario === i.prontuario)
                      i.visita_ativa = true;
                  })
                })
              }
              
              internados.sort((a,b) => {
                return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
              });

              res.render('recepcao.ejs', { data: internados })
                           
            } else {
              internados.sort((a,b) => {
                return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
              });
              res.render('recepcao.ejs', { data: internados })
            }            
          })         
        })
    })
    
    .post((req, res) => {
      if(req.body.visita_ativa !== ""){
        console.log(req.body)
        
        db.collection('visitas')
        .find({ prontuario: req.body.prontuario } )
        .toArray((err, doc) => {
          console.log(doc)
          res.render('registro_visitas', { data: doc[0] })
        })

      } else {
        res.render('cadastro.ejs', { data: req.body })
      }      
    })
}