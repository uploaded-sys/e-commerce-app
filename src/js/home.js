// Add this at the top of the file
const cart = new Cart();

function renderProduct(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${JSON.stringify(product)})">Add to Cart</button>
        </div>
    `;
}

function addToCart(product) {
    cart.addItem(product);
    showNotification('Item added to cart!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}
