const { DateTime } = require("luxon")


/* Podemos resumir o algoritmo daqui em uma busca no mongo.
O que eu preciso é: Filtrar as visitas somente de pacientes que
ainda permanecem internados.
Eu tenho uma coleção de visitas e uma lista de pacientes internados,
tudo no mongo, então eu posso fazer uma query nisso... vamos ver como */

module.exports = app => {
  app.route('/revisitar')
    .get((req, res) => {
      res.render('revisitar.ejs', { data: null })
    })
    .post((req, res) => {
      let pesquisa = req.body.pesquisa      
      db.collection('visitas_passadas')
        .find({
          $or:[
            { documento: new RegExp(pesquisa, 'i') },
            { prontuario: new RegExp(pesquisa, 'i') },
            { nome: new RegExp(pesquisa, 'i') },
            { visitante: new RegExp(pesquisa,'i') }
          ]
        }).limit(30)
        .toArray((err, visitas) => {
          if (err) return console.log(err)
          
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
        })
    })
}

const filtrarInternados = ( listaPacientes, listaVisitas ) => {

  //ORDENAR VISITAS
  listaVisitas.sort((a, b) => {
    return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0
  })
  
  //FILTRAR VISITAS REPETIDAS
  let filtrado = []

  for(let x = 0; x < listaVisitas.length-1; x++){
    console.log(x + " : "+ listaVisitas.length)
    if(listaVisitas[x].prontuario !== listaVisitas[x+1].prontuario) {
      filtrado.push(listaVisitas[x])

      if( x === listaVisitas.length-2 ){
        filtrado.push(listaVisitas[x])
      }
    }  
    
  }

  console.log("Total de visitas: "+listaVisitas.length)
  console.log("Visitas filtradas: "+filtrado.length)
  //FILTRAR VISITAS DE PACIENTES AINDA INTERNADOS
  
  
  return listaVisitas
  
}