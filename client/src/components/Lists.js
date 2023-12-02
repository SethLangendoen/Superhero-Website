import React, { useState, useEffect, useReducer } from 'react';
import { useRevalidator } from 'react-router-dom';

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
  const [publicListNotification, setPubliListNotification] = useState(''); 
  const [personalListNotification, setPersonalListNotification] = useState(''); 
  const [prevList, setPrevList] = useState(null);
  const [thisListDisplay, setThisListDisplay] = useState(false);


  // to reduce redundancy create one of these for LoggedInUsercredentials that stores the user. 
  // that way we only have to call get Credentials once. 


  // these are all for editing lists: 
  const [listNameEdit, setListNameEdit] = useState('');
  const [listDescEdit, setListDescEdit] = useState('');
  const [heroCollectionEdit, setHeroCollectionEdit] = useState('');
  const [publicity, setPublicity] = useState(false); 




   useEffect(() => {
    const fetchData = async () => {
      // Fetch the lists when the component mounts
      await setDBLists();
      setLoggedInUserLists(); 
    };
    fetchData(); 
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const createList = () => {
    
    fetch('/getCredentials')
      .then((response) => response.json())
      .then((data) => {

        if(!data.key.token){
          setPersonalListNotification('Guest users may not create lists'); 
          return
        }

        if(listName === ''){
          setPersonalListNotification('You must enter a list name'); 
        } else if (listDesc === ''){
          setPersonalListNotification('You must enter a description'); 
        } else if (heroCollection === ''){
          setPersonalListNotification('You must select at least one hero')
        } else {
          setPersonalListNotification(''); 
          return fetch('/createList', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': data.key.token,	
              },
            body: JSON.stringify({
              listName: listName,
              listDesc: listDesc,
              heroCollection: heroCollection,
              createdBy: data.key.nicknameInput,
            }),
          });

        }
      })
      .then(async (data) => {
        await setDBLists();
        setLoggedInUserLists(); 

      })

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



  // setting the public db lists.
  const setDBLists = async () => {
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
      .catch((error) => console.log('Error fetching lists'));
  };



  const showListDetails = (list) => {
    if (prevList === list) {
     setThisListDisplay(!thisListDisplay); 

    } else {
      setThisListDisplay(!thisListDisplay); 
      // Only set this if it's a new list
      setListOpened(!listOpened);
      setSelectedList(list);
      setHeroList(list.heroCollection);
      setEditDisplay(false);
      setPrevList(list);
    }
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


          setListNameEdit(''); 
          setListDescEdit(''); 
          setHeroCollectionEdit(''); 
          setPublicity(false); 


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
    return (Math.round(averageRating * 100) / 100 ) + '/10';
  }
};

const handleRatingChange = (value) => {
  setRating(value);
};

const handleCommentChange = (value) => {
  setComment(value);
};
 
// reconstructing this to be one big review. 
const submitReview = (listName, createdBy, comment, rating) => { // pput the rating and comment into here, then set them using setters here. 
  fetch('/getCredentials')
  .then((response) => response.json())
  .then(async (data) => {
  console.log(rating); 
  console.log(comment);
  if ((10 >= rating >= 1) && (rating != null)){
    setRating(null); 
    fetch('/addRating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': data.key.token,	
      },
      body: JSON.stringify({
        rating: rating,
        listName: listName,
        createdBy: createdBy
      }),
    })
  }
  if(comment != ''){
    fetch('/addReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': data.key.token,	
      },
      body: JSON.stringify({
        comments: comment,
        listName: listName,
        createdBy: createdBy
      }),
    })
    .then((response) => response.json())
    .then(async (data) => {
      // await setDBLists();
      // setLoggedInUserLists(); 
    }) 
  }

  if(!data.key.token){ // if it is a guest user. 
    setPubliListNotification('Guests users may not leave reviews'); 
  }
  setDBLists();
  setLoggedInUserLists(); 
})
}



// const submitComment = (listName, createdBy) => {
//   fetch('/getCredentials')
//   .then((response) => response.json())
//   .then(async (data) => {
//   await fetch('/addReview', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': data.key.token,	

//     },
//     body: JSON.stringify({
//       comments: comment,
//       listName: listName,
//       createdBy: createdBy
//     }),
//   })
//   .then((response) => response.json())
//   .then(async () => {
//     setDBLists();
//     setLoggedInUserLists(); 
//   })
//   if(!data.key.token){ // if it is a guest user. 
//     setPubliListNotification('Guests users may not leave reviews'); 
//   }

//   })
// }



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
    .then(async () => { // calling these in a .then statement so that they upate after delete list is finished. 
      
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

  <div id = "publicAndPrivateListBox">
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

        <p>{personalListNotification}</p>

          <p class = "subtitle"> Lists You've Made</p>
          <div id="displayLists">
            <ul>
              {personalLists.map((list) => (
                <li>
                  <strong key={list._id} onClick={() => showListDetails(list)}>{list.listName} - Created By: {list.createdBy || 'Guest'} </strong>
                  {thisListDisplay && (
                      <div>
                            
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



                      </div>
                  )}
                   
                  
                </li>
              ))}
            </ul>
          </div>
          </div>


          <div id="displayPublicLists">
            <p class = "subtitle">Public Lists</p>
            <p>{publicListNotification}</p>
            <ul>
              {lists.map((list) => (
                <li>
                  <strong key={list._id} onClick={() => showListDetails(list)}>
                    {list.listName} - Created By: {list.createdBy || 'Guest'} Contains {list.heroCollection.trim() ? list.heroCollection.split(',').length : 0} heroes - Rating: {getAverageRating(list)} 
                  </strong>        
                    
                  {thisListDisplay && (
                  <div>      
                    {selectedList === list && (
                        <ul>

                          <li>{list.listDesc}</li>


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

                          <label htmlFor="ratingInput">Rate this list (1-10): </label>
                          <input
                            type="number"
                            id="ratingInput"
                            name="rating"
                            min="1"
                            max="10"
                            onChange={(e) => handleRatingChange(e.target.value)}
                          />
                          {/* <button onClick={() => submitRating(list.listName, list.createdBy)}>Submit Rating</button> */}

                          <label htmlFor="commentInput">Leave a comment: </label>
                          <input
                            type="text"
                            id="commentInput"
                            name="comment"
                            onChange={(e) => handleCommentChange(e.target.value)}
                          />
                          <button onClick={() => submitReview(list.listName, list.createdBy, comment, rating)}>Submit Review</button>


                          <ul id="commentsList">
                            {list.comments.map((comment, index) => (
                              <li key={index}>
                                <div class="commentHeader">
                                  <span class="commentDate">{new Date(list.currentDateAndTime).toLocaleDateString()}</span>
                                </div>

                                  <span class="commenterName">{list.createdBy + " says:"}</span>
                                <div class="commentText">{comment}</div>
                              </li>
                            ))}
                          </ul>


                        </ul>
                      )}
                


                  </div>
                )}

                </li>
              ))}
            </ul>
          </div>
      </div>



    </div>



  );
}

export default Lists;
