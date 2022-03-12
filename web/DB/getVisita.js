const { connectDB } = require('./db')
const ObjectId = require('mongodb').ObjectID

/**
 *  Recebe o id de uma visita
 *  Retorna o objeto da visita e todos seus dados * 
 */

async function getVisita(id) {  
  let base = await connectDB()
  try {
    await base.connect()    
    return await base.db("hospitalDB").collection("visitas").findOne({"_id": ObjectId(id)});    
  } catch (e) {
    console.error(e);
  } finally {
    await base.close();
  }
}

module.exports = { getVisita }