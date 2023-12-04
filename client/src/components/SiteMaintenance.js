import React, { useState, useEffect } from 'react';

function SiteMaintenance() {
	const [users, setUsers] = useState([]);
	const [adminInput, setAdminInput] = useState('');
	const [adminUser, setAdminUser] = useState(false); 

	const [usersDeactivate, setDeactivateUsers] = useState([]);
	const [deactivateInput, setDeactivateInput] = useState('');

	const [create, setCreate] = useState(false); 
	const [policyName, setPolicyName] = useState(''); 
	const [policyText, setPolicyText] = useState(''); 
	const [policies, setPolicies] = useState([]); 
	const [viewPolicy, setViewPolicy] = useState(null); 
	const [editPolicyName, setEditPolicyName] = useState(''); 
	const [editPolicyText, setEditPolicyText] = useState(''); 



useEffect(() => {
	displayPolicies(); 
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


  const handlePolicy = (index) => {
    setViewPolicy(index); 
  };



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



  const createPolicy = async () => {
	try {
	  const response = await fetch('/insertPolicy', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  policyName: policyName,
		  policyText: policyText,
		}),
	  });
  
	  if (!response.ok) {
		throw new Error('Network response was not ok');
	  }
  
	  const data = await response.json();
	  displayPolicies();
	  // Optionally, you can use the data received from the server
	  console.log('Policy created successfully:', data);
	} catch (error) {
	  console.error('Error creating policy:', error);
	  // Handle the error appropriately, e.g., set an error state
	}
  };
  


  const displayPolicies = async () => {
	try {
	  const response = await fetch('/displayPolicies', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
	  });
  
	  // Check if the response status is ok before proceeding
	  if (!response.ok) {
		throw new Error('Network response was not ok');
	  }
  
	  const data = await response.json();
	  setPolicies(data.key);
	  console.log(data.key); 
	} catch (error) {
	  console.error('Error fetching policies:', error);
	}
  };
  

  const editPolicies = async (prevPolicy) => {

	try {
		const response = await fetch('/editPolicy', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
			policyName: editPolicyName,
			policyText: editPolicyText,
			prevPolicyName: prevPolicy.policyName
		  }),
		});
	
		if (!response.ok) {
		  throw new Error('Network response was not ok');
		}
	
		const data = await response.json();
		displayPolicies();
		// Optionally, you can use the data received from the server
		console.log('Policy created successfully:', data);
	  } catch (error) {
		console.error('Error creating policy:', error);
		// Handle the error appropriately, e.g., set an error state
	  }

	 
	
	displayPolicies();
  }




  return (
    <div>


	{adminUser && (

	<div id = "entirePolicyPage">
		<div id="grantAdminPrivilage" className = 'innerDiv'>
			<h3>Grant Administrator Privilage</h3>
			<input
			placeholder='search user'
			cassFor='searchUser'
			onChange={(e) => {
				setAdminInput(e.target.value)
			}}
			/>

			<div classFor = 'innerDiv'>
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




		<div id="deactivateUser" className = 'innerDiv'>

			<h3>Deactivate User</h3>
			<input
			placeholder='search user'
			classFor='searchUser'
			onChange={(e) => {
				setDeactivateInput(e.target.value)
			}}
			/>

			<div>
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

		<div className = 'innerDiv'>
		<div id='createPolicies'>
			<button onClick={() => setCreate(!create)}>Create Policy</button>
			{create && (
				<div id = "createPol">
				<input 
				tpe = "text"
				placeholder='Policy Name' 
				onChange = {(e) => setPolicyName(e.target.value)}
				/>
				<textarea 
				type = 'textarea'
				className = 'policyDesc'
				placeholder='Enter the policy information here' 
				onChange = {(e) => setPolicyText(e.target.value)}
				/>

				<button onClick = {() => createPolicy()}>Save Policy</button>

				</div>
			)}
		</div>



		<div id='displayPolicies' className = 'innerDiv'>
			{policies &&
				policies.map((policy, index) => (
				<div key={index}>
					<button id = 'editPolicy' onClick = {() => handlePolicy(index)}>Edit Policy</button>
					{viewPolicy === index && (
						<div id = "editPol">
							<input
							placeholder='Enter policy name here'
							onChange = {(e) => setEditPolicyName(e.target.value)}
							/>
							<textarea 
							className = 'policyDesc'
							placeholder='Enter policy text here'
							onChange = {(e) => setEditPolicyText(e.target.value)}
							/>
							<button onClick = {() => editPolicies(policy)}>Save Policy</button>
						</div>
					)}
					<p>{policy.policyName}</p>
					<p>{policy.policyText}</p>
					
				</div>
			))}
		</div>
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

