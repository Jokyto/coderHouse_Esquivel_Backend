const socket = io()
const table = document.getElementById('RealProductsTable')

socket.on('products', data =>{
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
    for(product of data){
        let tr = document.createElement('tr')
        tr.innerHTML=
        `
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.code}</td>
            <td>${product.stock}</td>
            <td>${product.thumbnail}</td>
        `
        table.getElementsByTagName('tbody')[0].appendChild(tr)
    }

})

document.addEventListener("DOMContentLoaded", function() {
    const messageInput = document.getElementById("message-input");
    const messageForm = document.getElementById("message-form");
    const messagesList = document.getElementById("messages");
  
    // Submit form on enter key press
    messageInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        messageForm.dispatchEvent(new Event("submit"));
      }
    });
  
    // Handle form submission
    messageForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const message = messageInput.value.trim();
      if (message) {
        addMessageToDB(message, true); // Add user's message to MongoDB
        messageInput.value = ""; // Clear input field
        // Perform any necessary processing or send the message to the server
      }
    });
  
    async function addMessageToDB(message, isSentByUser) {
  const newMessage = {
    user: isSentByUser ? "User" : "Other",
    message: message
  };
  
  try {
    await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newMessage)
    });
  
    addMessage(newMessage.message, isSentByUser); // Add message to the chat interface
  } catch (error) {
    console.error(error);
  }
  }
    // Function to add a new message to the chat interface
    function addMessage(text, isSentByUser) {
      const messageItem = document.createElement("li");
      messageItem.className = "message";
      if (isSentByUser) {
        messageItem.classList.add("user");
      } else {
        messageItem.classList.add("other");
      }
  
      const card = document.createElement("div");
      card.className = "card";
  
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
  
      const cardText = document.createElement("p");
      cardText.className = "card-text";
      cardText.textContent = text;
  
      const timestamp = document.createElement("span");
      timestamp.className = "timestamp text-muted";
      timestamp.textContent = new Date().toLocaleTimeString();
  
      cardBody.appendChild(cardText);
      cardBody.appendChild(timestamp);
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
  });