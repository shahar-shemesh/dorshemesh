const cancelBtn = document.getElementById('cancel-btn');
// const previousPageContent = document.getElementById('previousPageContent').value;


function cancelClickHandler (e) {
  e.preventDefault();
  e.target.form.content.value = e.target.form.previousPageContent.value;
}

cancelBtn.addEventListener('click', cancelClickHandler);