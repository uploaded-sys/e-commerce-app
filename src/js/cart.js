class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.loadCart();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            this.items = cartData.items;
            this.total = cartData.total;
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.updateTotal();
        this.saveCart();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateTotal();
        this.saveCart();
    }

    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.items = [];
        this.total = 0;
        this.saveCart();
    }
}

const cart = new Cart();

function renderCart() {
    const root = document.getElementById('root');
    
    if (cart.items.length === 0) {
        root.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        return;
    }

    const cartHTML = `
        <div class="cart-container">
            <h2>Shopping Cart</h2>
            <div class="cart-items">
                ${cart.items.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <p>Price: $${item.price}</p>
                            <p>Quantity: ${item.quantity}</p>
                        </div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-total">
                <h3>Total: $${cart.total.toFixed(2)}</h3>
                <button id="checkoutButton">Checkout</button>
            </div>
        </div>
    `;
    
    root.innerHTML = cartHTML;
    
    // Add event listeners after rendering
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            cart.removeItem(parseInt(id));
            renderCart();
        });
    });

    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }
}

function validateOrder() {
    if (cart.items.length === 0) {
        throw new Error('Cart is empty');
    }
    if (cart.total <= 0) {
        throw new Error('Invalid order total');
    }
    return true;
}

async function processOrder() {
    // Simulate API call to process order
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                orderId: 'ORD' + Math.random().toString(36).substr(2, 9)
            });
        }, 2000);
    });
}

async function checkout() {
    try {
        validateOrder();
        
        // Get button reference
        const checkoutBtn = document.getElementById('checkoutButton');
        if (!checkoutBtn) {
            throw new Error('Checkout button not found');
        }

        // Confirm checkout
        const confirmCheckout = confirm('Are you sure you want to proceed with checkout?');
        if (!confirmCheckout) {
            return;
        }
        
        // Show loading state
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';

        // Process the order
        const orderResult = await processOrder();
        
        if (orderResult.success) {
            const clearCartConfirm = confirm(`Order successful! Your order ID is: ${orderResult.orderId}\nWould you like to clear your cart?`);
            if (clearCartConfirm) {
                cart.clearCart();
            }
            renderCart();
        } else {
            throw new Error('Order processing failed');
        }
    } catch (error) {
        alert(`Checkout failed: ${error.message}`);
        renderCart(); // Re-render to reset button state
    } finally {
        const checkoutBtn = document.getElementById('checkoutButton');
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Checkout';
        }
    }
}

// Initial render
renderCart();