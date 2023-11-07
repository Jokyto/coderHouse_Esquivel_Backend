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
                        text: 'Error al intentar eliminar el producto, pruebe más tarde por favor!',
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
  fetch(`/api/carts/cid/product/${productId}`, {
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

//Cart deleting products
function deleteItem(productID) {
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
            fetch(`/api/products/${productID}`, {
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
                        text: 'Error al intentar eliminar el producto, pruebe más tarde por favor!',
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








