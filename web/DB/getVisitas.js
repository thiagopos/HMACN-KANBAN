const { connectDB } = require('./db')
const ObjectId = require('mongodb').ObjectID

/**
 * Recebe como atributo a lista de ids visitas de um paciente
 * Retorna as visitas referentes as ids
 * 
  */


/** Esse método eu primeiro busco a lista de visitas, filtro para obter somente as visitas unicas
 * faço a busca de imagens das visitas unicas e retorno.
 */
const getVisitas = async (visitantes) => {  
  let listaVisitantes = []
  let listaAUX = []

  if (visitantes !== undefined) {
    for (v of visitantes)
      listaAUX.push(await getVisita(v)) 

    listaAUX = await getUnicos(listaAUX)

    for (l of listaAUX)
      listaVisitantes.push(await getImagem(l))
      
    return listaVisitantes
  } else {
    return null
  }
}


const getUnicos = async visitas => {
  const uniqueIds = new Set();
  const unique = visitas.filter(element => {
    const isDuplicate = uniqueIds.has(element.documento);
    uniqueIds.add(element.documento);
    if (!isDuplicate) {
      return true;
    }
  });
  
  return unique
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


const getVisita = async (idVisita) => {
  let base = await connectDB()
  try {
    await base.connect()
    let visita = await base.db("hospitalDB").collection("visitas").findOne({ "_id": ObjectId(idVisita) });
    return visita
  } catch (e) {
    console.error(e);
  } finally {
    await base.close();
  }
}

module.exports = { getVisitas }