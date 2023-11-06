document.getElementById('forgotPasswordButton').addEventListener('click', () => {
    forgotPassword();
  });
    
  function forgotPassword() {
    const form = document.getElementById('forgotPasswordForm');
    const formData = new FormData(form);
  
    const user = {
      email: formData.get('email'),
    };

    if (Object.values(user).some(item => item.trim() === '')) {
      Swal.fire({
        icon: 'error',
        title: 'Falta de datos',
        text: 'Por favor rellene todos los campos.',
      });
      return;
    }
  
    fetch('/api/session/forgot', {
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
            title: 'Sent!',
            text: 'We sent you an email to recover your password!',
            icon: 'success'
          }).then(() => {
            window.location.href = '/api/session/login';
          });
        }
      })
      .catch(error => {
        Swal.fire({
            title: 'Error sending email',
            text: "We couldn't send you an email, contact the admin for further information.",
            icon: 'error'
        }).then(() => {
          console.log(error.message);
      });
    })
  }