const socket = io();


socket.on('updateProducts', (updatedProducts) => {

  const productList = document.getElementById('productList');


  productList.innerHTML = '';


  updatedProducts.forEach(product => {
    const listItem = document.createElement('li');
    listItem.textContent = `${product.title} - ${product.price}`;
    productList.appendChild(listItem);
  });
});


document.getElementById('addProductForm').addEventListener('submit', (event) => {
  event.preventDefault();


  const productName = document.getElementById('productName').value;
  const productPrice = document.getElementById('productPrice').value;


  document.getElementById('addProductForm').reset();


  socket.emit('addProduct', { title: productName, price: productPrice });
});
