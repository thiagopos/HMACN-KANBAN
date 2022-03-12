const { connectDB } = require('./db')
const ObjectId = require('mongodb').ObjectID

/**
 *  Recebe o id de um paciente
 *  Retorna o objeto do paciente e todos seus dados * 
 */

async function setVisita(visita) {
  let base = await connectDB()
  
  try {
    await base.connect()
    
    // Primeiro de tudo nós inserimos a imagem no banco de imagens e recuperamos o _id da mesma.
    // Devo verificar se a imagem já é um id ( caso de revisita )
    if(visita.imagem.length > 24) {
      delete visita.imagem64 // Não faremos o uso da imagem em base64, pois a mesma já esta salva no banco :D
      await base.db('hospitalDB')
      .collection('imagens')
      .insertOne({ imagem: visita.imagem })
      .then(async i => {
        visita.imagem = i.insertedId
      })
    }

    
    
    //crio uma variavel que irá receber o valor do id do paciente que foi enviado pelo req.body
    let paciente_id = null
    //crio uma variavel para recuperar o id da visita
    let visita_id = null

    // Insiro a visita no banco, agora com o valor da imagem substituido pela Id da mesma
    await base.db('hospitalDB')
      .collection('visitas')
      .insertOne(visita)
      .then(async v => {        
        visita_id = v.insertedId
      })
   
    await base.db('hospitalDB')
      .collection('pacientes_internados')
      .updateOne({
        _id: ObjectId(visita.paciente)
      },
        {
          $push: { visitas: visita_id }
        })

  } catch (e) {
    console.error(e);
  } finally {
    await base.close();
  }
}

module.exports = { setVisita }