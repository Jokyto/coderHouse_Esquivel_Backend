// Register

document.getElementById('registerUser').addEventListener('submit', event => {
    event.preventDefault();
    addUser();
  });
  
function addUser() {
  const form = document.getElementById('registerUser');
  const formData = new FormData(form);

  const user = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    age: formData.get('age'),
    password: formData.get('password'),
  };

  if (Object.values(user).some(item => item.trim() === '')) {
    Swal.fire({
      icon: 'error',
      title: 'Falta de datos',
      text: 'Por favor rellene todos los campos.',
    });
    return;
  }

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Registrado!',
          text: 'Se registro con exito!',
        }).then(() => {
          window.location.href = '/login';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: data.message || 'Un error ocurrio durante el registro.',
        });
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
}