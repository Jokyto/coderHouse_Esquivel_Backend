//Change roll
function changeUserRole(userId,currentRoll) {
    if (currentRoll != "ADMIN") {
        console.log("User ID: " + userId)
        fetch(`/api/users/premium/${userId}`, {
            method: 'GET'
        })
        .then(response => {
            console.log("Your fetch: " + response.status)
            
            if (response.status === 200) {
                console.log('Role changed successfully');
                Swal.fire({
                  icon: "success",
                  title: "Roll changed successfully!",
                  text: "The roll has been changed!",
                }).then(() => {window.location.reload()});
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to change roll!!",
                    text: response.message || "An error ocurred while changing rolls!",
                  }).then(() => {window.location.reload()});
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
}