const { connectDB } = require('./db')
const ObjectId = require('mongodb').ObjectID
const { DateTime } = require("luxon")

/**
 * Retorna as visitas ativas
 * 
  */


/** Esse método eu primeiro busco a lista de visitas, filtro para obter somente as visitas unicas
 * faço a busca de imagens das visitas unicas e retorno.
 */
const getVisitasAtivasPaciente = async (visitantes) => {
  let listaVisitantes = []
  let listaAUX = []

  if (visitantes !== null) {
    for (v of visitantes)
      listaVisitantes.push(await getImagem(v))

    for (l of listaVisitantes) {
      let time = await visitaAtiva(l)
      console.log(time.hours)
      if (time.hours <= 2) {
        console.log(await visitaAtiva(l))
        listaAUX.push(await getPaciente(l))
      }
    }

    return listaAUX
  } else {
    return null
  }
}

const getVisitante = async visita => {
  let base = await connectDB()
  try {
    await base.connect()
    let visitante = await base.db("hospitalDB").collection("visita").findOne({ "_id": ObjectId(visita) });
    return visitante
  } catch (e) {
    console.error(e);
  } finally {
    await base.close();
  }
}

const getImagem = async visita => {
  let base = await connectDB()
  try {
    await base.connect()
    let imagem = await base.db("hospitalDB").collection("imagens").findOne({ "_id": ObjectId(visita.imagem) });
    visita.imagem64 = imagem
    return visita
  } catch (e) {
    console.error(e);
  } finally {
    await base.close();
  }
}

const getPaciente = async visita => {
  let base = await connectDB()
  try {
    await base.connect()
    let paciente = await base.db("hospitalDB").collection("pacientes_internados").findOne({ "_id": ObjectId(visita.paciente) });
    visita.nome_paciente = paciente.nome_paciente
    return visita
  } catch (e) {
    console.error(e);
  } finally {
    await base.close();
  }
}

const visitaAtiva = async (visitante) => {
  const date1 = DateTime.now()
  const date2 = DateTime.fromJSDate(visitante.data);
  const diff = date1.diff(date2, ["hours"])
  return diff.toObject()
}

module.exports = { getVisitasAtivasPaciente }