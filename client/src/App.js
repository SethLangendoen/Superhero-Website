import './App.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';



// this will import all other components


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Fetch user information when the component mounts
  useEffect(() => {
    fetch('http://localhost:3000/getCredentials')
      .then(response => response.json())
      .then(data => {
        if (data.key.nicknameInput) {
          setLoggedInUser(data.key.nicknameInput);
        }
      })
      .catch(error => console.error('Error fetching user information:', error));
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts


  const handleLogout = () => {
    fetch('http://localhost:3000/logout', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        console.log(data.message); // Log the logout message
        setLoggedInUser(null); // Update the state to reflect logged out user
        window.location.href = '/login.html'; // redirecting to the login page. 

      })
      .catch(error => console.error('Error logging out:', error));
  };


  return (
    <div className="header">
      <h1>Superhero Hub</h1>
      <div className="user-info">
        <p>Logged in as: {loggedInUser || 'Guest'}</p>
      </div>
      <div className="settings-dropdown">
        <p>Settings</p>
        <div className="dropdown-content">
          <a>Change Password</a>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default App;







