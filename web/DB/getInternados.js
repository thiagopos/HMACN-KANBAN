const { connectDB } = require('./db')

/**
 *  Retorna a lista de todos pacientes internados.
 */

async function getInternados() {
  let base = await connectDB()
  try {
    await base.connect()    
    return await base.db("hospitalDB").collection("pacientes_internados").find().toArray();       
  } catch (e) {
    console.error(e);
  } finally {
    await base.close();
  }
}

module.exports = { getInternados }