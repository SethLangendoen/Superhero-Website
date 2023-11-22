    // Example login.js
    function toggleLoginForm(formId) {
		var form = document.getElementById(formId);
		var otherForms = document.querySelectorAll('form[id^="Form"]:not(#' + formId + ')');
  
		// Hide other forms
		otherForms.forEach(function (otherForm) {
		  otherForm.style.display = 'none';
		});
  
		// Toggle the visibility of the selected form
		form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
	  }