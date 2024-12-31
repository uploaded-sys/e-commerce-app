// Add this at the top of the file
const cart = new Cart();

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.updateCartUI();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            }
        }
        this.saveCart();
        this.updateCartUI();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.items.reduce((total, item) => total + item.quantity, 0);
        }
    }
}

function renderProduct(product) {
    const productData = encodeURIComponent(JSON.stringify(product));
    return `
        <div class="product-card">
            <img class="product-image" src="${product.image}" alt="${product.name}">
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description || ''}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
            <button class="buy-button" 
                    onclick="addToCart('${productData}')"
                    style="background: var(--dark-accent); color: white; border: none; cursor: pointer;">
                Add to Cart
            </button>
        </div>
    `;
}

function addToCart(productData) {
    try {
        const product = JSON.parse(decodeURIComponent(productData));
        if (!product.id) {
            throw new Error('Invalid product data');
        }
        cart.addItem(product);
        showNotification('Item added to cart!');
    } catch (error) {
        console.error('Error adding item to cart:', error);
        showNotification('Failed to add item to cart');
    }
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
