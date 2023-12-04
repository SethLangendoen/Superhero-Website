const createAccountButton = document.getElementById('createAccountButton');
const noti = document.getElementById('noti')


function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
  }



createAccountButton.addEventListener('click', function(){
  const nicknameInput = document.getElementById('nickname').value;
  const emailInput = document.getElementById('email').value;
  const passwordInput = document.getElementById('password').value;


  
  if(nicknameInput == ''){
    noti.innerHTML = 'Please enter a nickname'; 
  } else if(nicknameInput.length > 30) {
	noti.innerHTML = 'Nickname must be less than 30 characters'; 
  } else if (emailInput == ''){
		noti.innerHTML = 'Please enter an email'; 
  } else if (!isValidEmail(emailInput)) {
	noti.innerHTML = 'Please enter a valid email';
  } else if (passwordInput == ''){
		noti.innerHTML = 'Please enter a password'; 
  }  else if (passwordInput.length > 30) {
		noti.innerHTML = 'Password must be less than 30 characters';
  }
  
  else {

		fetch('http://localhost:8080/createAccount', {
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




