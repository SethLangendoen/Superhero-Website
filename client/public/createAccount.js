// Select the necessary input elements
const createAccountButton = document.getElementById('createAccountButton');
const noti = document.getElementById('noti')
// createAccountButton.disabled = true; 
// const notification = document.getElementById('notification'); 



// Add event listeners to inputs
// nicknameInput.addEventListener('input', validateForm);
// emailInput.addEventListener('input', validateForm);
// passwordInput.addEventListener('input', validateForm);

// // Function to validate the form and enable/disable the button
// function validateForm() {
//     const nickname = nicknameInput.value.trim();
//     const email = emailInput.value.trim();
//     const password = passwordInput.value.trim();

//     // Enable the button only if all fields are filled
//     createAccountButton.disabled = !(nickname && email && password);
// }


// function isValidEmail(email) {
//     // Define the regular expression pattern for a valid email address
//     const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
//     return pattern.test(email);
// }



createAccountButton.addEventListener('click', function(){
  const nicknameInput = document.getElementById('nickname').value;
  const emailInput = document.getElementById('email').value;
  const passwordInput = document.getElementById('password').value;
	// now we are fetching the /login route and putting the values in ourselves.
  
  if(nicknameInput == ''){
    noti.innerHTML = 'Please enter a nickname'; 
  } else if (emailInput == ''){
		noti.innerHTML = 'Please enter an email'; 
	} // IMPORTANT: there needs to be something to ensure the email in in valid format before moving on to password logic. 
	
	else if (passwordInput == ''){
		noti.innerHTML = 'Please enter a password'; 
	} else {

		fetch('http://localhost:3000/createAccount', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({ nicknameInput , emailInput, passwordInput}),
		})
		.then(response => response.json())
			.then(data => {
			if(data.key === "nickExists"){
				noti.innerHTML = "A user with this nickname already exists"; 
			} else if (data.key === 'userExists'){
				noti.innerHTML = 'A user with this email already exists'; 
			} else if (data.key === 'success'){
        alert('Account successfully created. Please navigate to your email to verify your account'); 
				window.location.href = '/login.html';
			}
		  })
	}
})




