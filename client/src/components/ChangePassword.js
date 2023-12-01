import React, { useState } from 'react';



function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [resultMessage, setResultMessage] = useState('');


  	const changePassword = () => {
		// using getCredentials to get the token of the logged in user. 
		fetch('/getCredentials')
		.then(response => response.json())
		.then(data => { // data holds the currently logged in user. 
			console.log(data.key.token)
			fetch('/changePassword', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			'Authorization': data.key.token,	
			},
			body: JSON.stringify({ password: newPassword }),
			})
			.then((response) => response.json())
			.then((data) => {
			setResultMessage(data.message);
			})
			.catch((error) => {
			console.error('Error changing password', error);
			setResultMessage(data.message); 
			});
		});
	}



  return (
    <div>
      <h2>Change Password</h2>
      <label htmlFor="newPass">Enter New Password</label>
      <input
        id="newPass"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={changePassword}>Save</button>
      <p>Result: {resultMessage}</p>
    </div>
  );
}

export default ChangePassword;
