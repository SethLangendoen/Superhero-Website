import React, { useState, useEffect } from 'react';

function Lists() {
  const [listName, setListName] = useState('');
  const [listDesc, setListDesc] = useState('');
  const [heroCollection, setHeroCollection] = useState('');
  const [lists, setLists] = useState([]);
  const [personalLists, setPersonalLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [notification, setNotification] = useState(''); 
  const [selectedHero, setSelectedHero] = useState(null);
  const [thisHeroList, setThisHeroList] = useState(null);
  const [listOpened, setListOpened] = useState(false); 
  const [heroOpened, setHeroOpened] = useState(true); 
  const [editDisplay, setEditDisplay] = useState(false); 
  const [rating, setRating] = useState(0); 
  const [comment, setComment] = useState(''); 

  // to reduce redundancy create one of these for LoggedInUsercredentials that stores the user. 
  // that way we only have to call get Credentials once. 


  // these are all for editing lists: 
  const [listNameEdit, setListNameEdit] = useState('');
  const [listDescEdit, setListDescEdit] = useState('');
  const [heroCollectionEdit, setHeroCollectionEdit] = useState('');
  const [publicity, setPublicity] = useState(false); 




  useEffect(() => {
    // Fetch the lists when the component mounts
    setDBLists();
    setLoggedInUserLists(); 
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const createList = () => {
    fetch('/getCredentials')
      .then((response) => response.json())
      .then((data) => {
        return fetch('/createList', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            listName: listName,
            listDesc: listDesc,
            heroCollection: heroCollection,
            createdBy: data.key.nicknameInput,
          }),
        });
      })
      .then((data) => { // code was for notifications. 
        // if(data.key){
        //   setNotification('You already have a list with that name!'); 
        //   console.log(notification);
        //   console.log('wtfff'); 
        // } else {
        //   setNotification(''); // everything worked to plan and we can remove the notification. 
        //   console.log(notification); 
        // }
        // Fetch the updated lists after creating a new one
        setDBLists();
        setLoggedInUserLists(); 
      })
      .catch((error) => console.log('Error Creating List:', error));
  };


  const setLoggedInUserLists = () => {

    fetch('/getCredentials')
    .then((response) => response.json())
    .then((data) => {

      fetch('/displayPersonalLists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createdBy: data.key.nicknameInput,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setPersonalLists(data.data);
        })
        .catch((error) => console.error('Error fetching lists:', error));
    })
  }



  const setDBLists = () => {
    fetch('/displayLists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLists(data.data);
      })
      .catch((error) => console.error('Error fetching lists:', error));
  };


  const showListDetails = (list) => {
    // only set this if it's a new list, 
    if (selectedList !== list){
      setListOpened(!listOpened); 
      setSelectedList(list); 
      setHeroList(list.heroCollection);  //  THIS WILL SET THE HERO LIST
      setEditDisplay(false);  
    }

    // if (listOpened === "true"){
    //   setSelectedList(null); 
    //   setListOpened("false")
    // }
  };

  const searchOnDDG = (name, publisher) => {
    const ddgSearchURL = `https://duckduckgo.com/?q=${encodeURIComponent(name + " " + publisher)}&ia=web`;
    window.open(ddgSearchURL, '_blank');

  }



  const setHeroList = (heroCollection) => {
    // this function needs to fetch list of names and return a list of the corresponding heroes. 
    fetch('/getHeroesByList', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        heroList: heroCollection // This hero collection should be the string of heroes separated by commas. 
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setThisHeroList(data.key);
      })
  }


  const showHeroDetails = (hero) => {
    // a fetch function to get the hero based off of the hero name.
    if (selectedHero === hero) { // hte list is already open. 
      setHeroOpened(!heroOpened);
      setSelectedHero(null); 
    } else {
      setSelectedHero(hero);
      setHeroOpened(true); // Ensure hero details are opened when selecting a new hero
    }
  };




  // prevListName used for finding a previous list
  const editExistingList = (prevListName) => {

    fetch('/getCredentials')
    .then((response) => response.json())
    .then((data) => {

      fetch('/editExistingList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newListName: listNameEdit,
          newListDesc: listDescEdit,
          newHeroCollection: heroCollectionEdit,
          newPublicity: publicity,
          createdBy: data.key.nicknameInput,
          prevListName: prevListName,

        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // setPersonalLists(data.data); // resetting the personal lists afterwards. 
          setDBLists();
          setLoggedInUserLists(); 
        })
        .catch((error) => console.error('Error fetching lists:', error));
    })
  }

// used by the public lists.
const getAverageRating = (list) => {
  if (!list.ratings || list.ratings.length === 0) {
    return 'none';
  } else {
    const ratingSum = list.ratings.reduce((sum, rating) => sum + Number(rating), 0);
    const averageRating = ratingSum / list.ratings.length;
    // Round to 2 decimal places
    return (Math.round(averageRating * 100) / 100 )+ '/10';
  }
};

const handleRatingChange = (value) => {
  setRating(value);
};



const submitRating = (listName, createdBy) => {

  console.log(rating); 
  fetch('/addRating', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rating: rating,
      listName: listName,
      createdBy: createdBy
    }),
  })
  .then((response) => response.json())
  .then(() => {
    setDBLists();
    setLoggedInUserLists(); 
  })

}




const handleCommentChange = (value) => {
  setComment(value);
};



const submitComment = (listName, createdBy) => {

  fetch('/addReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comments: comment,
      listName: listName,
      createdBy: createdBy
    }),
  })
  .then((response) => response.json())
  .then(() => {
    setDBLists();
    setLoggedInUserLists(); 
  })

}



  const deleteList = (listName, createdBy) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this list?');
    // If the user clicks "OK" in the confirmation dialog, proceed with deletion
    if (shouldDelete) {
    
    fetch('/deleteList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName: listName,
        createdBy: createdBy,
      }),
    })
    .then((response) => response.json)
    .then(() => { // calling these in a .then statement so that they upate after delete list is finished. 
      setDBLists(); 
      setLoggedInUserLists(); 
    })
  }
}

  // to display the dropdown of the edit display
  const selectedHeroEdit = () => {
    setEditDisplay(!editDisplay); // this should swap the edit display to on and off. 
  }




  return (
    <div>

		
    <div id = "createLists">
        <div id = 'innerDiv'>
          <p class = "subtitle">Create a Hero List</p>
          {/* <label htmlFor="name">Name</label> */}
          <input
            id="name"
            placeholder='Name'
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          ></input>
          {/* <label htmlFor="description">Description</label> */}
          <input
            id="description"
            placeholder='Description'
            value={listDesc}
            onChange={(e) => setListDesc(e.target.value)}
          ></input>
          {/* <label htmlFor="addHeroes">Add Heroes</label> */}
          <input
            id="addHeroes"
            placeholder="Separate hero names by commas"
            value={heroCollection}
            onChange={(e) => setHeroCollection(e.target.value)}
          ></input>
          
          {/* this needs to be a part of the editing functionality. 
          <label htmlFor = "privateCheckBox">Public</label>
          <input type = "checkbox" ></input> */}

          <button class = 'createListButton' onClick={createList}>Create List</button>
        </div>

        <p>{notification}</p>



        <p class = "subtitle"> Lists You've Made</p>
        <div id="displayLists">
          <ul>
            {personalLists.map((list) => (
              <li key={list._id} onClick={() => showListDetails(list)}>
                <strong>{list.listName} - Created By: {list.createdBy || 'Guest'} </strong>
                {selectedList === list && (
                  <ul>
                    <button class = 'createListButton' onClick ={() => selectedHeroEdit()}>Edit This List</button>
                    {editDisplay &&  (
                      <div id = "editDisplay">
                        {/* <label htmlFor = "nameInput">Name</label> */}
                        <input placeholder = "Name" id = "nameInput" onChange={(e) => setListNameEdit(e.target.value)}></input>
                        {/* <label htmlFor = "descriptionInput">Description</label> */}
                        <input placeholder = "Description" id = "descriptionInput" onChange={(e) => setListDescEdit(e.target.value)}></input>
                        {/* <label htmlFor = "heroInput">Heroes</label> */}
                        <input id = "heroInput" placeholder='separate hero names by commas' onChange={(e) => setHeroCollectionEdit(e.target.value)}></input>
                        <label htmlFor = "publicInput">Public</label>
                        <input id = "publicInput" type = "checkbox" onChange={(e) => setPublicity(e.target.checked)}></input>
                        <button onClick = {() => editExistingList(list.listName)}>Save</button>
                        <button onClick = {() => deleteList(list.listName, list.createdBy)}>Delete List</button>


                      </div>
                    )}



                    <li>{list.listDesc}</li>


                    {/* <li>Heroes: {list.heroCollection}</li> */}

                    {thisHeroList && thisHeroList.map((hero) => (

                      <li key={hero.id} onClick={ () => showHeroDetails(hero)}>
                        <strong>{hero.name} - {hero.Publisher} <button class = 'ddgSearch' onClick={() => searchOnDDG(hero.name, hero.Publisher)}>Search on DDG</button></strong>
                        

                        {selectedHero === hero && (
                        <ul>
                          <li>Gender: {hero.Gender}</li>
                          <li>Eye Color: {hero['Eye color']}</li>
                          <li>Race: {hero.Race}</li>
                          <li>Hair Color: {hero['Hair color']}</li>
                          <li>Height: {hero.Height}</li>
                          <li>Skin Color: {hero['Skin olor']}</li>
                          <li>Alignment: {hero.Alignment}</li>
                          <li>Weight: {hero.Weight}</li>
                        </ul>
                        )}
                      </li>

                    ))}



                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>


      <p>Public Lists</p>
      <div id="displayLists">
        <ul>
          {lists.map((list) => (
            <li key={list._id} onClick={() => showListDetails(list)}>
            <strong>
              {list.listName} - Created By: {list.createdBy || 'Guest'} -- # of heroes: {list.heroCollection.trim() ? list.heroCollection.split(',').length : 0} - Rating: {getAverageRating(list)} 
            </strong>              
            {selectedList === list && (
                <ul>

                  <li>Description: {list.listDesc}</li>


                  {thisHeroList && thisHeroList.map((hero) => (

                    <li key={hero.id} onClick={ () => showHeroDetails(hero)}>
                      <strong>{hero.name} - {hero.Publisher} <button onClick={() => searchOnDDG(hero.name, hero.Publisher)}>Search on DDG</button></strong>
                      
                      {selectedHero === hero && (
                      <ul>
                        <li>Gender: {hero.Gender}</li>
                        <li>Eye Color: {hero['Eye color']}</li>
                        <li>Race: {hero.Race}</li>
                        <li>Hair Color: {hero['Hair color']}</li>
                        <li>Height: {hero.Height}</li>
                        <li>Skin Color: {hero['Skin olor']}</li>
                        <li>Alignment: {hero.Alignment}</li>
                        <li>Weight: {hero.Weight}</li>
                      </ul>
                      )}


                    </li>

                  ))}

                  <label htmlFor="ratingInput">Rate this list (1-10): </label>
                  <input
                    type="number"
                    id="ratingInput"
                    name="rating"
                    min="1"
                    max="10"
                    onChange={(e) => handleRatingChange(e.target.value)}
                  />
                  <button onClick={() => submitRating(list.listName, list.createdBy)}>Submit Rating</button>


                  <label htmlFor="commentInput">Leave a comment: </label>
                  <input
                    type="text"
                    id="commentInput"
                    name="comment"
                    onChange={(e) => handleCommentChange(e.target.value)}
                  />
                  <button onClick={() => submitComment(list.listName, list.createdBy)}>Submit Comment</button>

                  <ul>
                    {/* In React, when rendering a list of elements using map, each rendered element should have a unique key prop. */}
                    {list.comments.map((comment, index) => (
                      <li key={index}>
                        {list.createdBy + ": "}
                        {new Date(list.currentDateAndTime).toLocaleDateString()}
                        {'\n' + comment}
                      </li>
                    ))}
                  </ul>

                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>


    </div>



  );
}

export default Lists;
