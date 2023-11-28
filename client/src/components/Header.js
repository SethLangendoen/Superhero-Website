// Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChangePassword from './ChangePassword';

function Header() {
  const [loggedInUser, setLoggedInUser] = useState(null);


  // Fetch user information when the component mounts
  useEffect(() => {
    fetch('http://localhost:3000/getCredentials')
      .then(response => response.json())
      .then(data => {
        if (data.key.nicknameInput) {
          setLoggedInUser(data.key.nicknameInput);
		  var token = data.key.token; 
		  console.log("token: " + token); 
        }
      })
      .catch(error => console.error('Error fetching user information:', error));
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        setLoggedInUser(null);
        window.location.href = '/login.html';
      })
      .catch(error => console.error('Error logging out:', error));
  };




  return (
	
    <div className="header">
      <h1><Link to = '/'>Superhero Hub</Link></h1>
      <div className="user-info">
        <p>Logged in as: {loggedInUser || 'Guest'}</p>
      </div>
      <div className="settings-dropdown">
        <p>Settings</p>
        <div className="dropdown-content">
          <Link to="/change-password">Change Password</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Header;




