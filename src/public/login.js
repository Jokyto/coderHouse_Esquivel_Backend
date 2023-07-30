document.getElementById('logoutButton').addEventListener('click', () => {
  logoutUser();
});

document.getElementById('loginButton').addEventListener('click', () => {
  loginUser();
});

function logoutUser() {
    fetch('/login/out', {
      method: 'GET',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Logout Error');
        }
      })
      .then(data => {
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

function loginUser(){
  fetch('/login', {
    method: 'POST',
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Login Error');
      }
    })
    .then(data => {
      if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Login exitoso!',
          text: 'Se a podido acceder a su cuenta con exito!.',
        }).then(() => {
          window.location.href = '/api/products';
        });
      } else {
        throw new Error('Login Error');
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: 'La contraseña y/o el e-mail no coinciden.',
      });
    });
}