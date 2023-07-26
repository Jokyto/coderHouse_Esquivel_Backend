document.getElementById('logoutButton').addEventListener('click', () => {
  logoutUser();
});

function logoutUser() {
    fetch('/login/out', {
      method: 'GET',
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // Parse the JSON response
        } else {
          throw new Error('Logout Error');
        }
      })
      .then(data => {
        // Check the status property in the response data
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Logout Successful!',
            text: 'You have been logged out successfully.',
          }).then(() => {
            window.location.href = '/login';
          });
        } else {
          throw new Error('Logout Error');
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
        Swal.fire({
          icon: 'error',
          title: 'Logout Error',
          text: 'An error occurred during logout.',
        });
      });
  }