const { connectDB } = require('./db')
const ObjectId = require('mongodb').ObjectID

/**
 * Retorna as visitas ativas
 * 
  */


/** Esse método eu primeiro busco a lista de visitas, filtro para obter somente as visitas unicas
 * faço a busca de imagens das visitas unicas e retorno.
 */
const getVisitasAtivas = async () => {  
  let listaVisitantes = []
  let listaAUX = []

  let visitantes = await getVisitas()  

  if (visitantes !== undefined) {
    for (v of visitantes)
     listaVisitantes.push(await getImagem(v))

    for (l of listaVisitantes) {
      listaAUX.push(await getPaciente(l))
    }      
            
    return listaAUX
  } else {
    return null
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

const getVisitas = async () => {
  let base = await connectDB()
  let tempo_visita = 2 // horas
  let ultimaHora = new Date()
  ultimaHora.setHours(ultimaHora.getHours() - tempo_visita)
  try {
    await base.connect()    
    return await base.db("hospitalDB").collection("visitas").find({ data: { $gt: ultimaHora }}).toArray();
  } catch (e) {
    console.error(e);
  } finally {
    await base.close();
  }
}

module.exports = { getVisitasAtivas }