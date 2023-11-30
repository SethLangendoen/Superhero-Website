const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

const client = new MongoClient(url, { useUnifiedTopology: true });

// mongo db connection setup and close handled in the db.js file. 

// lists will contain a name, description, hero collection, visibility flag of public or private (defualt private), lastModified
async function insertList(list) {
    const listsCollection = client.db(dbName).collection('lists');
    try {
        const result = await listsCollection.insertOne(list);

        if (!result.result.ok || !result.ops || result.ops.length === 0) {
            //throw new Error('Insertion Failure', result.result);
        }
        return result.ops[0];
    } catch (error) {
        throw new Error('Failed to insert', error);
    }
}



async function getAllLists() {
    const listsCollection = client.db(dbName).collection('lists');
    try {
        const lists = await listsCollection.find({}).toArray();
        return lists;
    } catch (error) {
        throw new Error('Failed to fetch lists', error);
    }
}




module.exports = {
	insertList, 
	getAllLists
};
