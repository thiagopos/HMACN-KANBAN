const docs = require('./internados.json')
const { MongoClient } = require('mongodb')
const URI = 'mongodb://localhost:27017'

const client = new MongoClient( URI, { useUnifiedTopology: true });

async function run() {
  
  try {
    await client.connect();
    const database = client.db("HMACN_DEV");
    const internados = database.collection("pacientes_internados");
    
    // essa opção previne que documentos adicionais sejam inseridos caso um falhe    
    const options = { ordered: true };
    const result = await internados.insertMany(docs, options);
    console.log(`${result.insertedCount} documentos foram inseridos`);
  
  } finally {

    await client.close();
  }
}

run().catch(console.dir);
