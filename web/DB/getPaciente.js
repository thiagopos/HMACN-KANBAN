const { connectDB } = require('./db')
const ObjectId = require('mongodb').ObjectID

/**
 *  Recebe o id de um paciente
 *  Retorna o objeto do paciente e todos seus dados * 
 */

async function getPaciente(id) {  
  let base = await connectDB()
  try {
    await base.connect()
    return await base.db("hospitalDB").collection("pacientes_internados").findOne({"_id": ObjectId(id)});    
  } catch (e) {
    console.error(e);
  } finally {
    await base.close();
  }
}

module.exports = { getPaciente }