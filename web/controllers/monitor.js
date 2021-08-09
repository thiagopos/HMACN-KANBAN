

module.exports = app => {
  app.route('tv/:cod').get((req, res) => {
    let cod = req.params.cod
    db.collection('pacientes_internados')
      .find({ cod: cod })
      .toArray((err, result) => {
        if (err) return res.send(err)
        let clinica = clinicaSTR(cod)
        formatarDados(result)
        let showData = criaPaginas(result)
        res.render('show.ejs', { data: showData, clinica: clinica })
      })
  
      const criaPaginas = (pacientes) => {
        const total = pacientes.length
        if (total <= 10) return pacientes
        const paginas = Math.ceil(total / 10)
        const time = Number(inMinutes())
        const pagNum = (time % paginas) * 10
        let pagExibir = []
        if (pagNum + 10 <= total) {
          pagExibir = pacientes.slice(pagNum, pagNum + 10)
        } else {
          pagExibir = pacientes.slice(pagNum, total)
        }
        return pagExibir
      }
      
      const clinicaSTR = (cod) => {
        return clinicas.find((c, i) => {
          if (c.codigo === cod) return c
        })
      }
      
      const inMinutes = () => {
        let horasMin = moment().format('hh:mm')
        let vetorHorasMin = horasMin.split(':')
        return Number(vetorHorasMin[0]) * 60 + Number(vetorHorasMin[1])
      }
  })
}