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
  for (product of data) {
    let tr = document.createElement('tr')
    tr.innerHTML =
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

