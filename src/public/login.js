document.getElementById('loginButton').addEventListener('click', () => {
  loginUser();
});

function logoutUser() {
    fetch('/api/session/login/out', {
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
            window.location.href = '/api/session/login';
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
  const form = document.getElementById('LookForUser');
  const formData = new FormData(form);

  const user = {};
  formData.forEach((value, key) => {
    user[key] = value;
  });

  if (Object.values(user).some(field => field.trim() === '')) 
  {
    Swal.fire({
      icon: 'error',
      title: 'Missing Fields',
      text: 'Por favor rellene todos los campos!.',
    });
    return;
  }
  fetch('/api/session/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
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
          window.location.href = '/products';
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