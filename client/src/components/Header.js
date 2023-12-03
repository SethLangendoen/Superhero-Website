// Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import ChangePassword from './ChangePassword';

function Header() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [sm, setSM] = useState(false); 

  // Fetch user information when the component mounts
  useEffect(() => {
    fetch('/getCredentials')
      .then(response => response.json())
      .then(data => {
        if(data && data.key.isAdmin){
          setSM(true);  
        } else {
          setSM(false)
        }

        if (data.key.nicknameInput) {
          setLoggedInUser(data.key.nicknameInput);
        }
        })
      .catch(error => console.error('Error fetching user information:', error));
  }, []);
  

  const handleLogout = () => {
    fetch('/logout', { method: 'POST' })
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
      <h1><Link to = '/index.html'>Superhero Hub</Link></h1>
      <div className="user-info">
      {sm && (
        <p>SM</p>
      )}
        <p>Logged in as: {loggedInUser || 'Guest'}</p>
      </div>
      <div className="settings-dropdown">
        <p>Settings</p>
        <div className="dropdown-content">
        {console.log("sm:", sm)}
          {sm && (
          <Link to="/site-maintenance">Site Maintenance</Link>
          )}
          <Link to="/change-password">Change Password</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Header;




