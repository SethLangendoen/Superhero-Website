// Select the necessary input elements
const nicknameInput = document.getElementById('nickname');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const createAccountButton = document.getElementById('createAccountButton');
createAccountButton.disabled = true; 
const notification = document.getElementById('notification'); 



// Add event listeners to inputs
nicknameInput.addEventListener('input', validateForm);
emailInput.addEventListener('input', validateForm);
passwordInput.addEventListener('input', validateForm);

// Function to validate the form and enable/disable the button
function validateForm() {
    const nickname = nicknameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Enable the button only if all fields are filled
    createAccountButton.disabled = !(nickname && email && password);
}



function isValidEmail(email) {
    // Define the regular expression pattern for a valid email address
    const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return pattern.test(email);
}



createAccountButton.addEventListener('click', async function(){
  if (isValidEmail){ // if the email was valid
    notification.textContent = "Account Created Successfully"; 
    
  }
})



