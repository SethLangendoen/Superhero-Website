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



function isValidEmail(email) {
    // Define the regular expression pattern for a valid email address
    var pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return pattern.test(email);
}


createAccountButton.addEventListener('click', async function() {
    try {
      // Validate email format
      if (!isValidEmail(emailInput.value.trim())) {
        alert('Email format is invalid');
        return;
      }
  
      // Create a client object.
      const clientInfo = {
        nickname: nicknameInput.value.trim(),
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        disabled: false,
      };
  
      // Make a POST request to create the client
      const response = await fetch('/create-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientInfo),
      });
  
      // Handle the response
      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data);
        alert(`Email sent to: ${clientInfo.email}`);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert('Failed to create client. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  });






