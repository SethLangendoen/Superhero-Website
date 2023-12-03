import React, { useState, useEffect } from 'react';

function SiteMaintenance() {
	const [users, setUsers] = useState([]);
	const [adminInput, setAdminInput] = useState('');
	const [adminUser, setAdminUser] = useState(false); 

	const [usersDeactivate, setDeactivateUsers] = useState([]);
	const [deactivateInput, setDeactivateInput] = useState('');



useEffect(() => {
	fetch('/getCredentials')
	.then(response => response.json())
	.then(data => {
	if(data && data.key.isAdmin){
		console.log('set admin called, here is the data put into it: ' + data.key.isAdmin); 
		setAdminUser(true); 
	} else {
		setAdminUser(false)
	}
	})
		.catch(error => console.error('Error fetching user information:', error));
}, []);



  const resetPrivilageList = async (newValue) => {
    try {
      const response = await fetch('/getUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminInput: newValue,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.key);
      } else {
        console.error('Failed to fetch users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };



  const resetDeactivateList = async (newValue) => {
    try {
      const response = await fetch('/getUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminInput: newValue,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeactivateUsers(data.key);
      } else {
        console.error('Failed to fetch users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // use Effect hook triggers every time that adminInput changes.
  useEffect(() => {
    resetPrivilageList(adminInput);
  }, [adminInput]);

  useEffect(() => {
    resetDeactivateList(deactivateInput);
  }, [deactivateInput]);






// A Set activation function 
const setActivation = (user, isChecked) => {

	fetch('/setActivation', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		// 'Authorization': user.token,
	},
	body: JSON.stringify({
		user: user,
		disabled: isChecked,
	})
	})
	.then((response) => response.json())
	.then((data) => {
	})
	.catch((error) => {
	console.error('Error setting activation:', error);
	});
	
  }
  

  // A Set privilages function
  const setPrivilages = (user, isChecked) => {
	

	fetch('/setAdminPrivilage', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		user: user,
		isAdmin: isChecked,
	})
	})
	.then((response) => response.json())
	.then((data) => {
	})
	.catch((error) => {
	console.error('Error setting activation:', error);
	});
	
  }



  return (
    <div>


	{adminUser && (

	<div>

		<div id="grantAdminPrivilage">
			<h3>Grant Administrator Privilage</h3>
			<input
			placeholder='search user'
			cassFor='searchUser'
			onChange={(e) => {
				setAdminInput(e.target.value)
			}}
			/>

			<div>
			{users.length > 0 && (
				<table>
				{users.map((user) => (
					<tr key={user._id}>
					<td>
					<p>{user.nicknameInput + "  "}</p>
					</td>
					<td>
					<input classFor='grantAdminCheck' type='checkbox' defaultChecked = {user.isAdmin} onChange = {(e) => setPrivilages(user, e.target.checked)}/>
					</td>
					</tr>

				))}
				</table>
				)}
			</div>
		</div>





		<h3>Deactivate User</h3>
		<input
			placeholder='search user'
			classFor='searchUser'
			onChange={(e) => {
				setDeactivateInput(e.target.value)
			}}
			/>

			<div id="deactivateUser">
				{usersDeactivate.length > 0 && (
					<table>
					{usersDeactivate.map((user) => (
						<tr key={user._id}>
						<td>
						<p>{user.nicknameInput + "  "}</p>
						</td>
						<td>
						<input classFor='grantAdminCheck' type='checkbox' defaultChecked = {user.disabled} onChange = {(e) => setActivation(user, e.target.checked)}/>
						</td>
						</tr>

					))}
					</table>
				)}
			</div>


		</div>
	)}
	{!adminUser && (
		<p>Only administrators can access this page. </p>
	)}

    </div>




  );
}



export default SiteMaintenance;

