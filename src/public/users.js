document.addEventListener('DOMContentLoaded', function () {
    const userRole =  "{{session.user.rol}}";
    const changeRol = document.getElementById("changeRol");
    changeUserRole(userRole);


    if (userRole != "ADMIN") {
        changeRol.style.display = "block";
    }
    else
    {
        changeRol.style.display = "none";
    }
});

//Change roll
function changeUserRole(userId) {
    fetch(`/api/users/premium/${userId}`, {
        method: 'GET'
    })
    .then(response => {
        if (response.status === "success") {
            console.log('Role changed successfully');
            Swal.fire({
              icon: "success",
              title: "Roll changed successfully!",
              text: "The roll has been changed!",
            });
            window.location.reload();
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Failed to change roll!!",
                text:
                  data.message || "An error ocurred while changing rolls!",
              });
        }
    })
    .catch((error) => {
        console.error("An error occurred:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error while trying to change the roll.",
        });
      });
}