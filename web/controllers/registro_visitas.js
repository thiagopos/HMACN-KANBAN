module.exports = app => {
  app.route('/registro_visitas')
  .get((req, res) => {
    db.collection('visitas_passadas')
      .find()
      .toArray((err, visitantes) => {
        if (err) return console.log(err)        
        
        db.collection('pacientes_internados')
          .find()
          .toArray((err, internados) => {
            if (err) return console.log(err)
            console.log(visitantes.length)
            console.log(internados.length)
            let lista_revisita = filtroVisitantes(internados, visitantes)
            
            lista_revisita.sort((a,b) => {
              return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
            });

            res.render('registro_visitas.ejs', { data: lista_revisita } )
        })
      })
  })
  
  .post((req, res) => {      
    res.render('cadastro.ejs', { data: req.body})
  })
}

const filtroVisitantes = (internados, visitantes) => {
  const lista = []

  visitantes.forEach(v => {
    internados.forEach( i => {
      if(v.prontuario === i.prontuario) {
        v.clinica = i.clinica
        v.leito = i.leito
        lista.push(v)       
      }
    })
  })

  return lista
}