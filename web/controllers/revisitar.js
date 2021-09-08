const { DateTime } = require("luxon")

module.exports = app => {
  app.route('/revisitar')

    .get((req, res) => {
      res.render('revisitar.ejs', {
        data: null
      })
    })


    // REGEX DEVERÁ BUSCAR TAMBÉM NA DATA DA VISITA
    .post((req, res) => {
      let pesquisa = req.body.pesquisa
      db.collection('visitas_passadas')
        .find({
          $or: [{ documento: new RegExp(pesquisa, 'i') },
                { prontuario: new RegExp(pesquisa, 'i') },
                { nome: new RegExp(pesquisa, 'i') },
                { visitante: new RegExp(pesquisa, 'i') }]
        }).limit(30)
        .toArray((err, visitas) => {
          if (err) return console.log(err)

          if(visitas.length > 0) {
            db.collection('pacientes_internados')
            .find()
            .toArray((err, internados) => {
              if (err) return console.log(err)              

              resultado = filtrarInternados(internados, visitas)

              resultado.forEach(p => {
                p.data = DateTime.fromISO(p.data).toLocaleString(DateTime.DATETIME_SHORT)
              })

              res.render('revisitar.ejs', {
                data: resultado
              })
            })
          } else {
            res.render('revisitar.ejs', {
              data: []
            })
          }  
        })
    })
}

const filtrarInternados = (listaPacientes, listaVisitas) => {

  //ORDENAR VISITAS
  listaVisitas.sort((a, b) => {
    return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0
  })

  //FILTRAR VISITAS REPETIDAS
  let filtrado = []
  
  if(listaVisitas.length <= 1) {
    filtrado.push(listaVisitas[0])
  } else {
    for (let x = 0; x < listaVisitas.length - 1; x++) { 
      if (listaVisitas[x].prontuario !== listaVisitas[x + 1].prontuario) {
        filtrado.push(listaVisitas[x])      
        if (x === listaVisitas.length - 2) {
          filtrado.push(listaVisitas[x])
        }
      } else {
        if (x === listaVisitas.length - 2) {
          filtrado.push(listaVisitas[x])
        }
      }
    }
  } 
  //FILTRAR VISITAS DE PACIENTES AINDA INTERNADOS
  
  //PRECISA FILTRAR OS PACIENTES QUE ESTÃO COM VISITA ATIVA... AI FICA PERFEITO.
  let revisitas = []

  listaPacientes.forEach(p => {
    filtrado.forEach(f => {
      if (p.prontuario === f.prontuario) {
        f.leito = p.leito
        f.clinica = p.clinica
        revisitas.push(f)
      }
    })
  })

  return revisitas

}