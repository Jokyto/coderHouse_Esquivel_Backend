document.getElementById('resetPasswordButton').addEventListener('click', () => {
  resetPassword();
});
  
function resetPassword() {
  const form = document.getElementById('resetPassword');
  const formData = new FormData(form);

  const user = {
    email: formData.get('email'),
    password: formData.get('password'),
    passwordVerifier: formData.get('passwordVerifier'),
  };

  if (Object.values(user).some(item => item.trim() === '')) {
    Swal.fire({
      icon: 'error',
      title: 'Missing fields',
      text: 'Please fill in the empty fields.',
    });
    return;
  }

  if (user.password != user.passwordVerifier) {
    console.log(user.password)
    console.log(user.passwordVerifier)
    Swal.fire({
      icon: 'error',
      title: 'Password incorrect',
      text: 'Please use the same password.',
    });
    return;
  }

  fetch('/api/session/resetPassword', {
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
          title: 'Success!',
          text: 'Your password has been updated!',
        }).then(() => {
          window.location.href = '/api/session/login';
        });
      }
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Sadly an error occurred!',
        text: 'There has been an error changing your password, please try again.',
      }).then(() => {
        window.location.href = '/api/session/register';
      });
    });
}