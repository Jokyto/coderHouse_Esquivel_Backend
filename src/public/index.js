const socket = io()
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

  // Check if any field is empty
  if (Object.values(product).some(field => field.trim() === '')) {
    Swal.fire({
      icon: 'error',
      title: 'Missing Fields',
      text: 'Please fill in all the fields.',
    });
    return; // Stop the function execution
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


//Cart deleting products

function deleteProduct(cartID, productID) {
    Swal.fire({
        title: 'Confirmar eliminación',
        text: 'Esta seguro de querer borrar el producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, estoy seguro!',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/carts/${cartID}/product/${productID}`, {
                method: "DELETE",
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: 'Listo!',
                        text: 'El producto ha sido eliminado.',
                        icon: 'success',
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error al intentar eliminar el producto, pruebe más tarde por favor!.',
                        icon: 'error',
                    });
                }
            })
            .catch(error => {
                console.error("Error al eliminar el producto:", error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Un error ocurrio durante la eliminación.',
                    icon: 'error',
                });
            });
        }
    });
}


//Agregar al carrito
function addToCart(productId) {
  const cartId = "64bf2ff9a1878003e2983063";
  fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          Swal.fire({
              icon: 'success',
              title: 'Producto agregado!',
              text: 'El producto se agrego exitosamente!',
          });
      } else {
          Swal.fire({
              icon: 'error',
              title: 'Error al agregar el producto!!',
              text: data.message || 'Un error ocurrio al intentar agregar el producto!',
          });
      }
  })
  .catch(error => {
      console.error('An error occurred:', error);
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while processing the request.',
      });
  });
}

