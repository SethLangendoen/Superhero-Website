//document.addEventListener('DOMContentLoaded', () => {
  const getInfoButton = document.getElementById('getSuperHeroInfo');
  const searchByButton = document.getElementById('searchByButton'); 
  const superherosearchedDiv = document.getElementById('superheroSearched');
  const superheroInfoDiv = document.getElementById('superheroInfo');
  const createListButton = document.getElementById('createListButton'); 
  const resultDiv = document.getElementById('resultDiv'); 
  const deleteListButton = document.getElementById('deleteListButton'); 
  const select = document.getElementById('GeneratedLists'); 
  const addSuperhero = document.getElementById('addSuperhero'); 
  const listsCreated = document.getElementBuId('listsCreated'); 




  getInfoButton.addEventListener('click', () => {
    alert('responsive'); 

    alert("wtffff")
    const superheroId = document.getElementById('superheroId').value;
    const superheroInfoDiv = document.getElementById('superheroInfo');
    const superheroPowersDiv = document.getElementById('superheroPowers');

    // Send an HTTP GET request to the server to get superhero information
    fetch(`/get_superhero_info/${superheroId}`)
      .then((response) => response.json())
      .then((data) => {
        superheroInfoDiv.innerHTML = ''; 
        superheroPowersDiv.innerHTML = ''; 
        // print the superheroes data
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            superheroInfoDiv.innerHTML += `${key}: ${data[key]}<br>`;
          }
        }
        superheroInfoDiv.innerHTML += "<br>"
        // Send another request to get superhero powers based on the name
        fetch(`/get_superhero_power/${data.name}`)
          .then((powersResponse) => powersResponse.json())
          .then((powersData) => {
            for (const key in powersData) {
              if (powersData.hasOwnProperty(key) && powersData[key] === "True") {
                  superheroPowersDiv.innerHTML += key + "<br>";
              }

            }
          })
          .catch((powersError) => {
            superheroPowersDiv.innerHTML = `Error: ${powersError.message}`;
          });

      })
      .catch((error) => {
        superheroInfoDiv.innerHTML = `Error: ${error.message}`;
        superheroPowersDiv.innerHTML = ''; // Clear the superhero powers display on error.
      });
  });














  searchByButton.addEventListener('click', function(){

    const valueSearched = document.getElementById('searchBy'); // for name, race or publisher. 
    const selectedValue = valueSearched.value; 
    

    const inputValue = document.getElementById('inputValue') // for the hero's name inputted
    const nValue = document.getElementById('nValue') // for the hero's name inputted


    superherosearchedDiv.innerHTML = '';

      fetch(`/search_superhero_ids/${inputValue.value}/${selectedValue}/${nValue.value}`)// n required right now

          .then((response) => response.json())
          .then((data) => {

              alert(selectedValue + 'was searched'); 
              data.forEach((id) => {




                if (selectedValue === 'name'){
                  
                  fetch(`/get_superhero_info/${id}`)
                  .then((response) => response.json())
                  .then((data) => {
                    // print the superheroes data
                    for (const key in data) {
                      if (data.hasOwnProperty(key)) {
                        superherosearchedDiv.innerHTML += `${key}: ${data[key]}<br>`;
                      }
                    }
                  })
                  .catch((powersError) => {
                    superherosearchedDiv.innerHTML = `Error: ${powersError.message}`;
                  });


                } else if (selectedValue === 'Race'){

                  fetch(`/get_superhero_info/${id}`)
                  .then((response) => response.json())
                  .then((data) => {
                    // print the superheroes data
                    for (const key in data) {
                      if (data.hasOwnProperty(key)) {
                        superherosearchedDiv.innerHTML += `${key}: ${data[key]}<br>`;
                      }
                    }
                  })
                  .catch((powersError) => {
                    superherosearchedDiv.innerHTML = `Error: ${powersError.message}`;
                  });



                } else if (selectedValue == 'Publisher'){

                  fetch(`/get_superhero_info/${id}`)
                  .then((response) => response.json())
                  .then((data) => {

                    for (const key in data) {
                      if (data.hasOwnProperty(key)) {
                        superherosearchedDiv.innerHTML += `${key}: ${data[key]}<br>`;
                      }
                    }
                  })
                  .catch((powersError) => {
                    superherosearchedDiv.innerHTML = `Error: ${powersError.message}`;
                  });


                  

                } else if (selectedValue == 'power'){

                  //alert('in power'); 
                  fetch(`/get_superhero_info/${id}`)
                  .then((response) => response.json())
                  .then((data) => {

                    //the data here should contain id's of the matching superheros with matching powers to the input field
                    // print the superheroes data 
                    for (const key in data) {
                      if (data.hasOwnProperty(key)) {
                        superherosearchedDiv.innerHTML += `${key}: ${data[key]}<br>`;
                      }
                    }
            
                  })
                  .catch((error) => {
                    superherosearchedDiv.innerHTML = `Error: ${error.message}`;
                  });

                }

              });
          })
          .catch((error) => {
              resultList.innerHTML = `Error: ${error.message}`;
          });

  }); 



// Stuff for the lists

// create a function called update lists created that iterates through the name of the json file to update all the options. 
updateLists = function(){
  fetch(`/get_ids_from_list/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    // this needs to be relative to the json file...
    .then((response) => response.json())
    .then((data) => {
    
      for(var item in data){
        var option = document.createElement('option'); 
        option.innerHTML = item; 
        listsCreated.appendChild(option)
      }

    })
    .catch((error) => {
      resultDiv.innerHTML = `Error: ${error.message}`;
    });
}



// Create a list
createListButton.addEventListener('click', function(){
  
  alert('responsive'); 
  const newListName = document.getElementById('listName'); 
  const listName = newListName.value; 

  // to create a list
  fetch(`/create_list/${listName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

    // this needs to be relative to the json file...
    .then((response) => response.json())
    .then((data) => {
      resultDiv.innerHTML = `List created with name: ${listName}`;

    })
    .catch((error) => {
      resultDiv.innerHTML = `Error: ${error.message}`;
    });

    updateLists(); 
});


// Delete a list
deleteListButton.addEventListener('click', function(){
  const listName = document.getElementById('listName'); 
  const listText = listName.value; 

  alert(listText); 
  alert('delete list trigger'); 

  // to create a list
  fetch(`/delete_list/${listText}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    })
    .then((response) => response.json())
    .then((data) => {
      resultDiv.innerHTML = `List deleted`;

    })
    .catch((error) => {
      resultDiv.innerHTML = `Error: ${error.message}`;
    });

    // to update the listnames displayed in GeneratedLists: 

    updateLists(); 
});

//});

