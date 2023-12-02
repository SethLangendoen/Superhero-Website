import React, { useState } from 'react';



function SiteMaintenance() {
  const [newPassword, setNewPassword] = useState('');
  const [resultMessage, setResultMessage] = useState('');



  return (
	<p>This is the site maintenance page!</p>
  );
}

export default SiteMaintenance;
