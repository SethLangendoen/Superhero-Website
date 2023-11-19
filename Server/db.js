// using mongodb as my database. 
// note that the creation of tables is unnecessary, as in the server.js 
// module you create clients there. 


const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

const client = new MongoClient(url, { useUnifiedTopology: true });

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

function getClient() {
	return client;
}

async function insertUser(user) {
    const usersCollection = client.db(dbName).collection('users');
    
    try {
        const result = await usersCollection.insertOne(user);

        if (!result.result.ok || !result.ops || result.ops.length === 0) {
            throw new Error('Insertion Failure', result.result);
        }

        return result.ops[0];
    } catch (error) {
        throw new Error('Failed to insert', error);
    }
}



async function updateUser(query, update) {
	const usersCollection = client.db(dbName).collection('users');
	const result = await usersCollection.updateOne(query, { $set: update });
	return result.modifiedCount;
}



async function closeMongoDBConnection() {
  await client.close();
  console.log('Closed MongoDB connection');
}



module.exports = {
	connectToMongoDB,
	closeMongoDBConnection,
	getClient,
	insertUser,
	updateUser,
};
