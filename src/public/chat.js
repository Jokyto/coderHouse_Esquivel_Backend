const socket = io(); // Connect to the Socket.io server

document.addEventListener("DOMContentLoaded", function () {
    const messageInput = document.getElementById("message-input");
    const messageForm = document.getElementById("message-form");
    const messagesList = document.getElementById("messages");
    const usernameModal = document.getElementById("username-modal");
    const usernameInput = document.getElementById("username-input");
    const usernameSubmit = document.getElementById("username-submit");
  
    let username = null; // Store the user's name
  
    // Check if the user's name is set, otherwise show the modal
    if (!localStorage.getItem("username")) {
      usernameModal.classList.add("show");
      usernameModal.style.display = "block";
    } 
    else {
      username = localStorage.getItem("username");
    }
  
    // Submit form on enter key press
    messageInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        messageForm.dispatchEvent(new Event("submit"));
      }
    });
  
    // Handle form submission
    messageForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const message = messageInput.value.trim();
      if (message) {
        addMessageToDB(message); // Add user's message to MongoDB
        messageInput.value = ""; // Clear input field
      }
    });
  
    // Handle username submission
    usernameSubmit.addEventListener("click", function (event) {
      const name = usernameInput.value.trim();
      if (name) {
        username = name;
        localStorage.setItem("username", name);
        usernameModal.classList.remove("show");
        usernameModal.style.display = "none";
      }
    });
  
    // Fetching messages
    async function addMessageToDB(message) {
      const newMessage = {
        message: message,
      };
  
      try {
        await fetch("/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });
      } catch (error) {
        console.error(error);
      }
    }
  
    // Function to add a new message to the chat interface
    function addMessage(text,user) {
      const messageItem = document.createElement("li");
      messageItem.className = "message"; // Add margin bottom class
  
      const card = document.createElement("div");
      card.className = "card mt-3";
  
      const cardBody = document.createElement("div");
      cardBody.className = "card-body ms-3";
  
      const cardTitle = document.createElement("h6");
      cardTitle.className = "card-title";
      cardTitle.innerHTML = `<em>${user}</em>`; // Apply italic style to the username
  
      const cardText = document.createElement("p");
      cardText.className = "card-text mb-1";
      cardText.textContent = text;
  
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      card.appendChild(cardBody);
      messageItem.appendChild(card);
  
      // Remove the placeholder if it exists
      const placeholder = messagesList.querySelector(".message-placeholder");
      if (placeholder) {
        placeholder.remove();
      }
  
      messagesList.appendChild(messageItem);
  
      // Scroll to the bottom of the chat body
      messagesList.scrollTop = messagesList.scrollHeight;
    }
  
    // Receive new messages from the server using Socket.io
    socket.on("message", function (data) {
      const { message, user } = data;
      addMessage(message, user);
    });
  });

  

const table = document.getElementById('RealProductsTable')

socket.on('products', data => {
  table.innerHTML =
    `
    <tr>
        <td><strong>Producto</strong></td>
        <td><strong>Descripción</strong></td>
        <td><strong>Precio</strong></td>
        <td><strong>Código</strong></td>
        <td><strong>Stock</strong></td>
        <td><strong>Categoria</strong></td>
    </tr>
    `;
  for (docs of data) {
    let tr = document.createElement('tr')
    tr.innerHTML =
      `
            <td>${docs.title}</td>
            <td>${docs.description}</td>
            <td>${docs.price}</td>
            <td>${docs.code}</td>
            <td>${docs.stock}</td>
            <td>${docs.thumbnail}</td>
        `
    table.getElementsByTagName('tbody')[0].appendChild(tr)
  }
})


//RealTimeProducts modal and adding products

document.getElementById('addProductForm').addEventListener('submit', event => {
  event.preventDefault();
  addProduct();
});

function closeModal() {
  const modalElement = document.getElementById('addProductModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
}

function addProduct() {
  const form = document.getElementById('addProductForm');
  const formData = new FormData(form);

  const product = {};
  formData.forEach((value, key) => {
    product[key] = value;
  });

  if (Object.values(product).some(field => field.trim() === '')) {
    Swal.fire({
      icon: 'error',
      title: 'Missing Fields',
      text: 'Please fill in all the fields.',
    });
    return;
  }

  fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Product Added',
          text: 'The product has been added successfully!',
        }).then(() => {
          closeModal(); // Close the modal after the SweetAlert is dismissed
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Add Product',
          text: data.message || 'An error occurred while adding the product.',
        });
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
}
  
  