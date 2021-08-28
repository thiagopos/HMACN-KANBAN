const { DateTime } = require("luxon")

module.exports = VISITAS => {
  const DURACAO_MAX = 120;
  const DATA_ATUAL = DateTime.now().setZone('America/Recife').toISO()
  let visitas_ativas = []

  VISITAS.forEach(v => {
    const D1 = DateTime.fromISO(v.data)
    const D2 = DateTime.fromISO(DATA_ATUAL)
    let DIFF = D1.diff(D2, ['minutes'])
    DIFF = DIFF.toObject()

    if (Math.abs(DIFF.minutes) < DURACAO_MAX) {
      visitas_ativas.push(v)
    } else {
      db.collection('visitas').findOneAndDelete({
        prontuario: v.prontuario
      }, (err, doc) => {
        if (err) return console.log("Nenhum visitante ativo.")
        if (doc) {
          db.collection('visitas_passadas').insertOne(doc.value, err => {
            if (err) return console.log(err)
            console.log('Salvo no Banco de Dados' + v.nome)
          })
        }
      })
    }
  })

  return visitas_ativas
}