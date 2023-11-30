import React, { useState, useEffect } from 'react';

function Lists() {
  const [listName, setListName] = useState('');
  const [listDesc, setListDesc] = useState('');
  const [heroCollection, setHeroCollection] = useState('');
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [notification, setNotification] = useState(''); 
  const [selectedHero, setSelectedHero] = useState(null);
  const [thisHeroList, setThisHeroList] = useState(null);
  const [listOpened, setListOpened] = useState('true'); 
  const [heroOpened, setHeroOpened] = useState(true); 

  useEffect(() => {
    // Fetch the lists when the component mounts
    setDBLists();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const createList = () => {
    fetch('http://localhost:3000/getCredentials')
      .then((response) => response.json())
      .then((data) => {
        return fetch('http://localhost:3000/createList', {
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
      })
      .catch((error) => console.log('Error Creating List:', error));
  };


  const setDBLists = () => {
    fetch('http://localhost:3000/displayLists', {
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
      // setListOpened("true"); 
      setSelectedList(list); 
      setHeroList(list.heroCollection) //  THIS WILL SET THE HERO LIST
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
    fetch('http://localhost:3000/getHeroesByList', {
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

  return (
    <div>
		
      <div id="createLists">
        <p>Create a Hero List</p>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        ></input>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          value={listDesc}
          onChange={(e) => setListDesc(e.target.value)}
        ></input>
        <label htmlFor="addHeroes">Add Heroes</label>
        <input
          id="addHeroes"
          placeholder="Separate hero names by commas"
          value={heroCollection}
          onChange={(e) => setHeroCollection(e.target.value)}
        ></input>
        <button onClick={createList}>Create List</button>
      </div>

      <p>{notification}</p>

      <div id="displayLists">
        <ul>
          {lists.map((list) => (
            <li key={list._id} onClick={() => showListDetails(list)}>
              <strong>{list.listName} - Created By: {list.createdBy || 'Guest'}</strong>
              {selectedList === list && (
                <ul>
                  <li>Description: {list.listDesc}</li>


                  {/* <li>Heroes: {list.heroCollection}</li> */}

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
