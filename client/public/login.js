const notification = document.getElementById("notification"); 
const goButton = document.getElementById("goButton")


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
		fetch('http://localhost:3000/login', {
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
			} else if (data.key === 'success'){
				window.location.href = '/index.html';

			}
		  })
	}
})



