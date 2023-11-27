  const getInfoButton = document.getElementById('getSuperHeroInfo');
  const searchByButton = document.getElementById('searchByButton'); 
  const superherosearchedDiv = document.getElementById('superheroSearched');
  const superheroInfoDiv = document.getElementById('superheroInfo');
  const createListButton = document.getElementById('createListButton'); 
  const resultDiv = document.getElementById('resultDiv'); 
  const deleteListButton = document.getElementById('deleteListButton'); 
  const select = document.getElementById('GeneratedLists'); 
  const addSuperhero = document.getElementById('addSuperhero'); 
  const listsCreated = document.getElementById('listsCreated'); 
  const addHeroesButton = document.getElementById('addHeroesButton'); 
  const addedHeroesText = document.getElementById('addedHeroesText'); 
  const displayList = document.getElementById('displayList'); 
  const listDisplay = document.getElementById('listDisplay'); 
  const sortBy = document.getElementById('sortBy'); 
  const sortByList = document.getElementById('sortByList'); 
  const listSort = document.getElementById('listSort'); 
  const pattern = /^[IVXLCDM\sA-Za-z.-]+$/; // used for input sanitization, allows regular text, periods, dashes and roman numerals. 
  const loginLink = document.getElementById('login'); 
  const loggedInAs = document.getElementById('loggedInAs'); 
  var userToken; 



  // // this route gets the user's information for use every time we enter the page. 
  // if (window.location.pathname === '/Index.html') {

  //   console.log('in window'); 
  //   fetch("/getCredentials")
  //   .then(response => response.json())
  //   .then((data) => {
  //     if(data.key.nicknameInput != undefined){
  //       loggedInAs.textContent = 'logged in as ' + data.key.nicknameInput; 
  //       userToken = data.key.token; 
  //     } else { // this might be handled by a logout. 
  //       loggedInAs.textContent = 'logged in as guest'; 
  //     }
  //   })
  // }


  


















//   // sorting function: 
// const sortButton = document.getElementById('sort'); 

// sortButton.addEventListener('click', function(){
//   sortDivsAndAppend();
// })

// function sortDivsAndAppend() {
//   // Get an array of the div elements
//   const divs = Array.from(superherosearchedDiv.getElementsByClassName('divClass'));

//   // Sort the divs based on the text content of the second child
//   divs.sort((a, b) => {

//     if (sortBy.value === 'name'){
//       const textA = a.children[1].textContent; // Access the second child
//       const textB = b.children[1].textContent; // Access the second child
//       return textA.localeCompare(textB); // Compare text content alphabetically
//     } else if (sortBy.value === 'Race'){
//       const textA = a.children[4].textContent; // Access the second child
//       const textB = b.children[4].textContent; // Access the second child
//       return textA.localeCompare(textB); // Compare text content alphabetically
//     } else if (sortBy.value === 'Publisher'){
//       const textA = a.children[7].textContent; // Access the second child
//       const textB = b.children[7].textContent; // Access the second child
//       return textA.localeCompare(textB); // Compare text content alphabetically
//     }

//   });

//   // Clear the container
//   superherosearchedDiv.innerHTML = '';

//   // Append the sorted divs back to the container
//   divs.forEach(div => superherosearchedDiv.appendChild(div));
// }



// searchByButton.addEventListener('click', function(){

//   const valueSearched = document.getElementById('searchBy'); // for name, race or publisher. 
//   const selectedValue = valueSearched.value; 
  
//   const inputValue = document.getElementById('inputValue') // for the hero's name inputted
//   const nValue = document.getElementById('nValue') // for the hero's name inputted

//   if (inputValue.value == ''){
//     superherosearchedDiv.textContent = 'Enter a hero name to search for'
//   } else if (!pattern.test(inputValue.value)){
//     superherosearchedDiv.textContent = 'Invalid characters inputted'
//   } else {

//     superherosearchedDiv.innerHTML = '';
//     fetch(`/api/open/search_superhero_ids/${inputValue.value}/${selectedValue}/${nValue.value || 1000}`)

//         .then((response) => response.json())
//         .then((data) => {

//             data.forEach((id) => {


//               if (selectedValue === 'name'){
                
//                 fetch(`/api/open/get_superhero_info/${id}`)
//                 .then((response) => response.json())
//                 .then((data) => {
//                   // print the superheroes data
//                   const div = document.createElement('div'); 
//                   div.setAttribute('class', 'divClass'); 
//                   for (const key in data) {
//                     if (data.hasOwnProperty(key)) {
//                       const p = document.createElement('p'); 
//                       p.setAttribute('class','data-key'); 
//                       p.textContent = key + ': ' + data[key]; 
//                       div.appendChild(p); 
//                       //superherosearchedDiv.innerHTML += `${key}: ${data[key]}<br>`;
//                     }
//                   }
//                   superherosearchedDiv.appendChild(div)
//                 })
//                 .catch((powersError) => {
//                   superherosearchedDiv.innerHTML = `Error: ${powersError.message}`;
//                 });


//               } else if (selectedValue === 'Race'){

//                 fetch(`/api/open/get_superhero_info/${id}`)
//                 .then((response) => response.json())
//                 .then((data) => {

//                   // print the superheroes data
//                   const div = document.createElement('div'); 
//                   div.setAttribute('class', 'divClass'); 

//                   for (const key in data) {
//                     if (data.hasOwnProperty(key)) {
//                       const p = document.createElement('p'); 
//                       p.setAttribute('id','data-key'); 
//                       p.textContent = key + ': ' + data[key]; 
//                       div.appendChild(p); 
//                       //superherosearchedDiv.innerHTML += `${key}: ${data[key]}<br>`;
//                     }
//                   }
//                   superherosearchedDiv.appendChild(div)

//                 })
//                 .catch((powersError) => {
//                   superherosearchedDiv.innerHTML = `Error: ${powersError.message}`;
//                 });


//               } else if (selectedValue == 'Publisher'){

//                 fetch(`/api/open/get_superhero_info/${id}`)
//                 .then((response) => response.json())
//                 .then((data) => {

//                   const div = document.createElement('div'); 
//                   div.setAttribute('class', 'divClass'); 

//                   for (const key in data) {
//                     if (data.hasOwnProperty(key)) {
//                       const p = document.createElement('p'); 
//                       p.setAttribute('class','data-key'); 
//                       p.textContent = key + ': ' + data[key]; 
//                       div.appendChild(p); 
//                       //superherosearchedDiv.innerHTML += `${key}: ${data[key]}<br>`;
//                     }
//                   }
//                   superherosearchedDiv.appendChild(div)

//                 })
//                 .catch((powersError) => {
//                   superherosearchedDiv.innerHTML = `Error: ${powersError.message}`;
//                 });


                

//               } else if (selectedValue == 'power'){
//                 console.log('inside power')
//                 fetch(`/api/open/get_superhero_info/${id}`)
//                 .then((response) => response.json())
//                 .then((data) => {

//                   //the data here should contain id's of the matching superheros with matching powers to the input field
//                   // print the superheroes data 
//                   const div = document.createElement('div'); 
//                   div.setAttribute('class', 'divClass'); 

//                   for (const key in data) {
//                     if (data.hasOwnProperty(key)) {
//                       const p = document.createElement('p'); 
//                       p.setAttribute('id','data-key'); 
//                       p.textContent = key + ': ' + data[key]; 
//                       div.appendChild(p); 
//                       //superherosearchedDiv.innerHTML += `${key}: ${data[key]}<br>`;
//                     }
//                   }
//                   superherosearchedDiv.appendChild(div)

//                 })
//                 .catch((error) => {
//                   superherosearchedDiv.innerHTML = `Error: ${error.message}`;
//                 });

//               }

//             });
//         })
//         .catch((error) => {
//             superherosearchedDiv.innerHTML = `Error: ${error.message}`;
//         });
//   }

// }); 


// // create a function called update lists created that iterates through the name of the json file to update all the options. 
// updateLists = function(){
//   fetch(`/api/open/get_ids_from_list/`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     // this needs to be relative to the json file...
//     .then((response) => response.json())
//     .then((data) => {
//       listsCreated.innerHTML = ''; 
//       for(var item of data){
//         var option = document.createElement('option'); 
//         option.innerHTML = item; 
//         listsCreated.appendChild(option)
//       }

//     })
//     .catch((error) => {
//       resultDiv.innerHTML += `this is the culprit: ${error.message}`;
//     });
// }
// updateLists(); 






// // Create a list
// createListButton.addEventListener('click', function(){
  
//   const newListName = document.getElementById('listName'); 
//   const listName = newListName.value; 
//   if(listName == ''){
//     resultDiv.innerHTML = 'Please enter a list name'; 
//   } else if (!pattern.test(listName)){
//     resultDiv.textContent = 'Invalid characters inputted'
//   } else {
//   // to create a list
//   fetch(`/api/open/create_list/${listName}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     // this needs to be relative to the json file...
//     .then((response) => response.json())
//     .then((data) => {
//       resultDiv.innerHTML = `List created with name: ${listName}`;
//     })
//     .catch((error) => {
//       resultDiv.innerHTML = `Here -> Error: ${error.message}`;
//     });
//     updateLists(); 
//   }

// });



// // Delete a list
// deleteListButton.addEventListener('click', function(){
//   const listName = document.getElementById('listName'); 
//   const listText = listName.value; 

//   if(listText == ''){
//     resultDiv.innerHTML = 'Please enter a list name'; 
//   } else if (!pattern.test(listText)){
//     resultDiv.textContent = 'Invalid characters inputted'
//   } else {

//     fetch(`/api/open/delete_list/${listText}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       })
//       .then((response) => response.json())
//       .then((data) => {
//         resultDiv.innerHTML = `List deleted`;
//       })
//       .catch((error) => {
//         resultDiv.innerHTML = `Error: ${error.message}`;
//       });
//       // to update the listnames displayed in GeneratedLists: 
//       updateLists(); 
//   }
// });



// addHeroesButton.addEventListener('click', function(){
//   const list = document.getElementById('list'); 
//   const herosInput = document.getElementById('addSuperhero'); 
//   var idList = []; 
//   var idText = ''; 
//   var namesFound = herosInput.value.split(','); 
//   const pattern = /[<>[\](){}]/;


//   if(list.value == ''){
//     addedHeroesText.innerHTML = 'Please Enter a list name: '
//   } else if (herosInput.value == ''){
//     addedHeroesText.innerHTML = 'Please Enter heroes to be added to the list: '
//   } else if (pattern.test(herosInput.value)){
//     addedHeroesText.innerHTML = 'Invalid characters inputted'
//   } else {
//     // Create an array of promises for each fetch request
//     var fetchPromises = namesFound.map(item => {
//       return new Promise((resolve, reject) => {
//         fetch(`/api/open/get_superhero_i/${item}`)
//           .then((response) => response.json())
//           .then((data) => {
//             idList.push(data.id);
//             idText += '' + data.id + ','; 

//             resolve(); // Resolve the promise when this fetch request is done
//           })
//           .catch((powersError) => {
//             reject(powersError); // Reject the promise in case of an error
//           });
//       });
//     });


//   Promise.all(fetchPromises)
//   .then(() => {
//     console.log("Should be full list of ids: " + idText); 

//     fetch(`/api/open/add_ids_to_list/${list.value}/${idText.slice(0,-1)}`)
//     .then((response) => response.json)
//     .then((data) => {
//       addedHeroesText.innerHTML = 'Successfully added heroes'; 
//     })
//     .catch((error) => {
//       // Handle any errors that occurred during the fetch request
//       console.error('Error:', error);
//     });

//   })    
//   .catch((error) => {
//     console.error('Error:', error);
//   });

//   }

// });  



// listSort.addEventListener('click', function(){
//   console.log('event listened'); 
//   sortDivs(); 
// })



// function sortDivs() {
//   console.log('in sort divs'); 
//   // Get an array of the div elements
//   const divs = Array.from(listDisplay.getElementsByClassName('displayedListHeroes'));

//   // Sort the divs based on the text content of the second child
//   divs.sort((a, b) => {

//     if (sortByList.value === 'name'){
//       const textA = a.children[0].textContent; // Access the second child
//       const textB = b.children[0].textContent; // Access the second child
//       return textA.localeCompare(textB); // Compare text content alphabetically
//     } else if (sortByList.value === 'Race'){
//       const textA = a.children[3].textContent; // Access the second child
//       const textB = b.children[3].textContent; // Access the second child
//       return textA.localeCompare(textB); // Compare text content alphabetically
//     } else if (sortByList.value === 'Publisher'){
//       const textA = a.children[6].textContent; // Access the second child
//       const textB = b.children[6].textContent; // Access the second child
//       return textA.localeCompare(textB); // Compare text content alphabetically
//     }

//   });
//   // Clear the container
//   listDisplay.innerHTML = '';
//   // Append the sorted divs back to the container
//   divs.forEach(div => listDisplay.appendChild(div));
// }




// displayList.addEventListener('click', function(){

//   console.log('button clicked'); 

//   fetch(`/api/open/get_info_from_list/${listsCreated.value}`)
//   .then((response) => response.json())
//   .then((data) => {
//     // Process the data and display the superheroes
//     displaySuperheroes(data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

//   function displaySuperheroes(superheroes) {
//     console.log('function displaySuperheroes called'); 
//     if (superheroes && superheroes.length > 0) {
//       listDisplay.innerHTML = ''; // Clear the previous content
  
//       superheroes.forEach(([heroInfo, heroPowers]) => {
//         const superheroElement = document.createElement('div');
//         superheroElement.setAttribute('class','displayedListHeroes'); 

//         superheroElement.innerHTML = `
//           <p><b>Name:</b> ${heroInfo[0]}</p>
//           <p>Gender: ${heroInfo[1]}</p>
//           <p>Eye color: ${heroInfo[2]}</p>
//           <p>Race: ${heroInfo[3]}</p>
//           <p>Hair color: ${heroInfo[4]}</p>
//           <p>Height: ${heroInfo[5]}</p>
//           <p>Publisher: ${heroInfo[6]}</p>
//           <p>Skin color: ${heroInfo[7]}</p>
//           <p>Alignment: ${heroInfo[8]}</p>
//           <p>Weight: ${heroInfo[9]}</p>
//         `;
        
      
//         // Check if heroPowers is defined before building the powers list
//         if (Array.isArray(heroPowers)) {
//           const powersList = document.createElement('div');
//           const heading = document.createElement('h4'); 
//           const br = document.createElement('br'); 
//           heading.textContent = 'Powers: ';
//           powersList.appendChild(heading); 
//           heroPowers.forEach((power) => {
//             const powerItem = document.createElement('p');
//             powerItem.textContent = power;
//             powersList.appendChild(powerItem);
//             powersList.appendChild(br)
//           });
//           superheroElement.appendChild(powersList);
//         } else {
//           // Handle the case where heroPowers is not an array (e.g., it might be null or an object)
//           // You can choose to display an error message or handle it as needed.
//         }
        
//         listDisplay.appendChild(superheroElement);

//       });
//     } else {
//       listDisplay.innerHTML = 'No superheroes found for the given list name.';
//     }
//   }
  

// })














