const { MongoClient } = require('mongodb')

async function connectDB() {
    const uri = "mongodb://smshacn310:27017"
    return new MongoClient(uri, {useUnifiedTopology: true})
}

module.exports = { connectDB }