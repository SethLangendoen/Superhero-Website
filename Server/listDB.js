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


async function editList(newListName, newListDesc, newHeroCollection, newPublicity, createdBy, prevListName) {
    const listsCollection = client.db(dbName).collection('lists');

    if (newPublicity === true){
        var visibility = "public"; 
    } else {
        visibility = "private"; 
    }
  
    // Assuming you have a unique identifier like _id for your documents
    const foundList = await listsCollection.findOne({ listName: prevListName, createdBy: createdBy });
    var currentDateAndTime = new Date();
    console.log(currentDateAndTime); 
    // Define the updates based on provided parameters, if they are empty no update is done. 
    const updates = {
      $set: {
        listName: newListName !== '' ? newListName : foundList.listName,
        listDesc: newListDesc !== '' ? newListDesc : foundList.listDesc,
        heroCollection: newHeroCollection !== '' ? newHeroCollection : foundList.heroCollection,
        visibility: visibility,
        currentDateAndTime: currentDateAndTime, 
      },
    };
  
    try {
      // Update the document based on the unique identifier (_id)
      const result = await listsCollection.updateOne({ _id: foundList._id }, updates);
  
      if (result.modifiedCount === 1) {
        console.log("List updated successfully");
      } else {
        console.log("Failed to update the list");
      }
    } catch (error) {
      console.error("Error updating list:", error);
    }
  }


async function addRating(rating, listName, createdBy){
  const listsCollection = client.db(dbName).collection('lists');
  const foundList = await listsCollection.findOne({ listName: listName, createdBy: createdBy });
  const updates = {
    $push: {
      ratings: rating
    },
  };

  try {
    const result = await listsCollection.updateOne({ _id: foundList._id }, updates);
    if (result.modifiedCount === 1) {
      console.log("List updated successfully");
    } else {
      console.log("Failed to update the list");
    }
  } catch (error) {
    console.error("Error updating list:", error);
  }
}

async function addReview(comment, listName, createdBy){
  const listsCollection = client.db(dbName).collection('lists');
  const foundList = await listsCollection.findOne({ listName: listName, createdBy: createdBy });
  const updates = {
    $push: {
      comments: comment
    },
  };

  try {
    const result = await listsCollection.updateOne({ _id: foundList._id }, updates);
    if (result.modifiedCount === 1) {
      console.log("list updated successfully");
    } else {
      console.log("Failed to update the list");
    }
  } catch (error) {
    console.error("Error updating list:", error);
  }
}


async function deleteList(listName, createdBy){
  const listsCollection = client.db(dbName).collection('lists');

  console.log(listName + " " + createdBy); 
  const filter = {listName: listName, createdBy: createdBy}; 

  listsCollection.deleteOne(filter, (error, result) => {
    if (error) {
      console.error('Error deleting document:', error);
      return;
    }
    console.log('Document deleted successfully:', result);
  })

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
	getAllLists, 
  editList, 
  deleteList,
  addRating,
  addReview
};
