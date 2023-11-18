document.addEventListener('DOMContentLoaded', function () {
    // Select the necessary input elements
    const nicknameInput = document.getElementById('nickname');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const createAccountButton = document.getElementById('createAccountButton');

	createAccountButton.disabled = true; 

	
    // Add event listeners to inputs
    nicknameInput.addEventListener('input', validateForm);
    emailInput.addEventListener('input', validateForm);
    usernameInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);

    // Function to validate the form and enable/disable the button
    function validateForm() {
        const nickname = nicknameInput.value.trim();
        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Enable the button only if all fields are filled
        createAccountButton.disabled = !(nickname && email && username && password);
    }

	createAccountButton.addEventListener('click', function(){
		console.log('button clicked'); 
	})
});



