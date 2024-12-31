const cat = document.getElementById("app");
let currentPage = 0;
const productsPerPage = 10;
let allProducts = [];

async function getData() {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=198');
        const data = await response.json();
        allProducts = data.products;
        renderProducts();
        addShowMoreButton();
    } catch (error) {
        console.error('Error fetching products:', error);
        cat.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

function renderProducts() {
    const startIndex = currentPage * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = allProducts.slice(startIndex, endIndex);

    currentProducts.forEach(product => {
        cat.innerHTML += `
            <div class="product-card">
                <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
                <div class="product-details">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-rating">Rating: ${product.rating}⭐</div>
                    <button class="buy-button" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
    });
}

function addShowMoreButton() {
    const showMoreContainer = document.createElement('div');
    showMoreContainer.className = 'show-more-container';
    
    const showMoreButton = document.createElement('button');
    showMoreButton.className = 'show-more-button';
    showMoreButton.textContent = 'Show More';
    
    showMoreButton.addEventListener('click', () => {
        currentPage++;
        renderProducts();
        
        // Disable button if no more products (adjusted for 198 products)
        if ((currentPage + 1) * productsPerPage >= 198) {
            showMoreButton.disabled = true;
            showMoreButton.textContent = 'No More Products';
        }
    });
    
    showMoreContainer.appendChild(showMoreButton);
    cat.appendChild(showMoreContainer);
}

getData();

function addToCart(productId) {
    console.log('Added product to cart:', productId);
    // Implement cart functionality here
}
