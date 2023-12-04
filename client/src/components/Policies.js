// Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import ChangePassword from './ChangePassword';

function Policies() {
  const [policies, setPolicies] = useState([]); 



// displays policies when the page loads. 
useEffect(() => {
	displayPolicies(); 
}, []);

// funciton to display the policies. 
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
	} catch (error) {
		console.error('Error fetching policies:', error);
	}
}



  return (

		<div>

				<div id='displayPolicies'>
					{policies &&
						policies.map((policy, index) => (
						<div key={index}>

							<p>{policy.policyName}</p>
							<p>{policy.policyText}</p>
							
						</div>
					))}
				</div>

		</div>

	);

}


export default Policies;