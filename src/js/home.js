class Cart {
    constructor() {
        this.items = [];
        this.loadCart();
        this.updateCartUI();
        this.displayCart();
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem('shopping-cart');
            if (savedCart) {
                this.items = JSON.parse(savedCart);
                console.log('Cart loaded:', this.items);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
            localStorage.removeItem('shopping-cart');
        }
    }

    saveCart() {
        try {
            localStorage.setItem('shopping-cart', JSON.stringify(this.items));
            console.log('Cart saved:', this.items);
        } catch (error) {
            console.error('Error saving cart:', error);
            this.showNotification('Error saving cart');
        }
    }

    addItem(product) {
        try {
            const existingItem = this.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
            this.saveCart();
            this.updateCartUI();
            this.displayCart();
            return true;
        } catch (error) {
            console.error('Error adding item:', error);
            this.showNotification('Error adding item to cart');
            return false;
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.displayCart();
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
        this.displayCart();
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.items.reduce((total, item) => total + item.quantity, 0);
        }
    }

    displayCart() {
        // Check if we're on the cart page
        const cartPageContainer = document.getElementById('cart-items-page');
        if (cartPageContainer) {
            this.displayCartPage(cartPageContainer);
        } else {
            this.displayCartPopup();
        }
    }

    displayCartPage(container) {
        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <h2>Your cart is empty</h2>
                    <a href="../index.html" class="buy-button">Continue Shopping</a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="product-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                    <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button onclick="cart.removeItem('${item.id}')" class="remove-btn">Remove</button>
                </div>
            </div>
        `).join('');

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        container.innerHTML += `
            <div class="cart-total">
                <h3>Total: $${total.toFixed(2)}</h3>
                <button onclick="cart.checkout()" class="checkout-btn">Proceed to Checkout</button>
            </div>
        `;
    }

    displayCartPopup() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        cartContainer.innerHTML = this.items.length ? this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain;">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button onclick="cart.removeItem('${item.id}')" class="remove-btn">×</button>
                </div>
            </div>
        `).join('') : '<p>Your cart is empty</p>';

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartContainer.innerHTML += `
            <div class="cart-total">
                <h3>Total: $${total.toFixed(2)}</h3>
                ${this.items.length ? '<button onclick="cart.checkout()" class="checkout-btn">Checkout</button>' : ''}
            </div>
        `;
    }

    checkout() {
        alert('Proceeding to checkout...');
        // Add checkout logic here
    }

    showNotification(message) {
        showNotification(message);
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

// Move cart initialization to DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
});
