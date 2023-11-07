const socket = io(); // Connect to the Socket.io server

socket.on('products', data => {
  const table = document.getElementById('RealProductsTable')
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
  