const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

const client = new MongoClient(url, { useUnifiedTopology: true });

// mongo db connection setup and close handled in the db.js file. 

async function insertPolicy(policyName, policyText) {
    const policiesCollection = client.db(dbName).collection('policies');
    try {
        const result = await policiesCollection.insertOne({
            policyName: policyName,
            policyText: policyText
        });

        if (!result.result.ok || !result.ops || result.ops.length === 0) {
            // Handle insertion failure if needed
            // throw new Error('Insertion Failure', result.result);
        }
        return result.ops[0];
    } catch (error) {
        throw new Error('Failed to insert', error);
    }
}



async function editPolicy(policyName, policyText, previousPolicyName) {
    const policiesCollection = client.db(dbName).collection('policies');

  
    // Assuming you have a unique identifier like _id for your documents
    const foundPolicy = await policiesCollection.findOne({ policyName: previousPolicyName});

    // Define the updates based on provided parameters, if they are empty no update is done. 
    const updates = {
      $set: {
        policyName: policyName,
        policyText: policyText, 
      },
    };
  
    try {
      // Update the document based on the unique identifier (_id)
      const result = await policiesCollection.updateOne({ _id: foundPolicy._id }, updates);
  
      if (result.modifiedCount === 1) {
        console.log("Policy updated successfully");
      } else {
        console.log("failed to update the policy");
      }
    } catch (error) {
      console.error("Error updating policy:", error);
    }
  }



  async function getPolicies(){
	const policiesCollection = client.db(dbName).collection('policies');
    try {
        const policies = await policiesCollection.find({}).toArray();
        return policies;
    } catch (error) {
        throw new Error('Failed to fetch poilicies', error);
    }
  }


module.exports = {
	insertPolicy, 
	editPolicy, 
	getPolicies
};