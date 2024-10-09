const cancelBtn = document.getElementById('cancel-btn');


function cancelClickHandler(e) {
  e.preventDefault();

  const form = e.target.form;
  const currentPage = form.page.value;

  switch (currentPage) {
    /************************************************************************************** */
    case 'home':
      form.content.value = JSON.parse(form.previousContent.value);
      break;
    /************************************************************************************** */
    /************************************************************************************** */
    case 'contact':
      const previousContentContact = JSON.parse(form.previousContent.value);

      // Loop through each previous content item and update the form fields
      previousContentContact?.forEach((item, index) => {
        // Find corresponding inputs for each platform and link
        const platformInput = form.querySelectorAll('.platform-type')[index];
        const linkInput = form.querySelectorAll('.platform-link')[index];

        // Set the inputs back to their original values
        if (platformInput && linkInput) {
          platformInput.value = item.platform;
          linkInput.value = item.link;
        }
      });
      break;
    /************************************************************************************** */
    /************************************************************************************** */
    case 'project':
      const previousContentProject = JSON.parse(form.previousContent.value);
      // Reset projectName and projectDesc back to their original values
      form.projectName.value = previousContentProject.projectName;
      form.projectDesc.value = previousContentProject.projectDesc;
      break;
    /************************************************************************************** */
    /************************************************************************************** */
    default:
      break;
  }

}

cancelBtn?.addEventListener('click', cancelClickHandler);