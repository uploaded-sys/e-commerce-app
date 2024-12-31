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
                        <button onclick="cart.removeItem(${item.id}); renderCart();">Remove</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-total">
                <h3>Total: $${cart.total.toFixed(2)}</h3>
                <button onclick="checkout()">Checkout</button>
            </div>
        </div>
    `;
    
    root.innerHTML = cartHTML;
}

function checkout() {
    alert('Proceeding to checkout...');
    // Add checkout logic here
}

// Initial render
renderCart();