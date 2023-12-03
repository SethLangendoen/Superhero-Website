const notification = document.getElementById("notification"); 
const goButton = document.getElementById("goButton"); 
const guest = document.getElementById('guest'); 

goButton.addEventListener('click', function(){
	const email = document.getElementById('userEmail').value;
	const password = document.getElementById('userPassword').value;
	// now we are fetching the /login route and putting the values in ourselves. 
	
	if(email == ''){
		notification.innerHTML = 'Please enter an email'; 
	} // here needs to be something to ensure the email in in valid format before moving on to password logic. 
	
	
	else if (password == ''){
		notification.innerHTML = 'Please enter a password'; 
	} else {
		fetch('/login', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})
		.then(response => response.json())
		.then(data => {
			if (data.key === 'notVerified'){
			  notification.innerHTML = 'You must verify your account before logging in'; 
			} else if (data.key === 'incorrectCredentials'){
			  notification.innerHTML = 'Your email or password is incorrect'; 
			} else if (data.key === 'incorrectCredentials'){
			  notification.innerHTML = 'Your email or password is incorrect'; 
			} else if(data.key === 'disabled'){
				notification.innerHTML = 'Your account has been disabled. Please contact Administrator at fake#gmail.com '
			} else if (data.key === 'success'){
				window.location.href = '/index.html';
			}
		  })
	}
})



guest.addEventListener('click', function(){
	// so that the logged in user variable is reset and a user can't change the password of the last person who logged in. 
	fetch('/logout', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	})
	.then(response => response.json())
	.then(data => {
		console.log("logged out"); 
		alert('logged out'); 
	})
})



