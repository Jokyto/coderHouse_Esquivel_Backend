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
    } else {
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
        user: username,
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
  
  
  
  