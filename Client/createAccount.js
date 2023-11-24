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

		fetch('/createAccount', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({ nicknameInput , emailInput, passwordInput}),
		})
		.then(response => response.json())
		.then(data => {
			if (data.key === 'notVerified'){
			  noti.innerHTML = 'You must verify your account before logging in'; 
			} else if (data.key === 'incorrectCredentials'){
			  noti.innerHTML = 'Your email or password is incorrect'; 
			} else if (data.key === 'success'){
        alert('account successfully created'); 
				window.location.href = '/login.html';
			}
		  })
	}
})




