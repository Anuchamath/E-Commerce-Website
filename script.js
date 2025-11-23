const PRODUCTS = [
    { id: 1, name: 'Aether Phone 1 Pro', price: 359990.00, description: 'The new Aether Phone 1 Pro with the revolutionary A18 Bionic chip.', image: 'https://ik.imagekit.io/khfk7iqko/phone%201.png', category: 'flagship' },
    { id: 2, name: 'Pixel Shift 9', price: 299990.00, description: 'The AI-powered Pixel Shift 9. Magic Editor and Best Take make every photo perfect.', image: 'https://ik.imagekit.io/khfk7iqko/phone%202.png', category: 'flagship' },
    { id: 3, name: 'Orion Fold 5', price: 539990.00, description: 'Unfold a massive 7.6-inch tablet display. The ultimate device for productivity.', image: 'https://ik.imagekit.io/khfk7iqko/phone%203.png', category: 'foldable' },
    { id: 4, name: 'Nova Lite X', price: 149990.00, description: 'Flagship features at a mid-range price. 120Hz display, 108MP camera.', image: 'https://ik.imagekit.io/khfk7iqko/phone%207.png', category: 'budget' },
    { id: 5, name: 'Zenith Compact', price: 209990.00, description: 'Powerful performance in a compact, one-handed design.', image: 'https://ik.imagekit.io/khfk7iqko/phone%208.png', category: 'budget' },
    { id: 6, name: 'Titan ROG Gamer', price: 269990.00, description: 'Built for gamers. Air-triggers, a massive cooling system, and a 165Hz screen.', image: 'https://ik.imagekit.io/khfk7iqko/phone%205.png', category: 'gaming' },
    { id: 7, name: 'Nebula Max 7', price: 419990.00, description: 'A 7-inch phablet with a stunning 4K display and stylus support.', image: 'https://ik.imagekit.io/khfk7iqko/phone%206.png', category: 'flagship' },
    { id: 8, name: 'Photon Flip Z', price: 479990.00, description: 'The stylish flip phone is back. A large cover screen and a flexible main display.', image: 'https://ik.imagekit.io/khfk7iqko/phone%204.png', category: 'foldable' }
];

let cart = JSON.parse(localStorage.getItem('liquifyCart')) || [];

function saveCart() {
    localStorage.setItem('liquifyCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

function addToCart(id) {
    const product = PRODUCTS.find(p => p.id == id);
    const existing = cart.find(item => item.id == id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
    alert(`${product.name} added to cart!`);
}

function updateQty(id, change) {
    const item = cart.find(i => i.id == id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) cart = cart.filter(i => i.id != id);
        saveCart();
        renderCart();
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id != id);
    saveCart();
    renderCart();
}

function getCartTotal() {
    return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
}

function formatPrice(price) {
    return `LKR ${price.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
}

function createProductCard(product) {
    return `
    <div class="glass-card product-card fade-in-up">
        <div class="product-img-wrap">
            <img src="${product.image}" alt="${product.name}" class="product-img" onclick="window.location.href='product.html?id=${product.id}'">
            <span class="price-badge">${formatPrice(product.price)}</span>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc">${product.description.substring(0, 50)}...</p>
            <button class="btn-add" onclick="addToCart(${product.id})">
                <i data-lucide="shopping-bag"></i> Add to Cart
            </button>
        </div>
    </div>`;
}

// --- Newsletter Logic (New) ---
function handleNewsletter() {
    const newsBtn = document.querySelector('.news-form button');
    const newsInput = document.querySelector('.news-form input');
    
    if (newsBtn && newsInput) {
        newsBtn.addEventListener('click', () => {
            if (newsInput.value.trim() !== "") {
                alert("Thank you for subscribing to our newsletter!");
                newsInput.value = "";
            } else {
                alert("Please enter a valid email address.");
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    updateCartCount();
    handleNewsletter(); // Initialize newsletter

    setTimeout(() => {
        const loader = document.querySelector('.loader-container');
        const app = document.getElementById('app-wrapper');
        if(loader) loader.style.display = 'none';
        if(app) app.classList.remove('hidden');
    }, 1500);

    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if(menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    const path = window.location.pathname;

    // Home Page Logic
    if (path.includes('index') || path === '/' || path.endsWith('/')) {
        const grid = document.getElementById('featured-grid');
        if (grid) {
            grid.innerHTML = PRODUCTS.slice(0, 3).map(createProductCard).join('');
            lucide.createIcons();
        }
    }

    // Products Page Logic
    if (path.includes('products')) {
        const grid = document.getElementById('all-products-grid');
        if (grid) {
            grid.innerHTML = PRODUCTS.map(createProductCard).join('');
            lucide.createIcons();
        }
    }

    // Product Detail Logic
    else if (path.includes('product')) { 
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const product = PRODUCTS.find(p => p.id == id);
        const container = document.getElementById('product-detail-container');

        if (product && container) {
            container.innerHTML = `
                <div class="detail-left">
                    <img src="${product.image}" class="detail-img">
                </div>
                <div class="detail-right">
                    <span class="stock-badge">In Stock</span>
                    <h1 style="font-size: 2.5rem; margin: 10px 0;">${product.name}</h1>
                    <p class="detail-price">${formatPrice(product.price)}</p>
                    <p style="color: #9ca3af; line-height: 1.6; margin-bottom: 30px;">${product.description}</p>
                    
                    <div style="display: flex; gap: 15px; margin-bottom: 30px;">
                        <div class="glass-card p-4 center" style="width: 80px;"><i data-lucide="zap" style="color:#facc15"></i><br><small>Fast</small></div>
                        <div class="glass-card p-4 center" style="width: 80px;"><i data-lucide="shield" style="color:#4ade80"></i><br><small>Secure</small></div>
                    </div>

                    <button class="btn btn-primary" style="width: auto; padding: 15px 40px;" onclick="addToCart(${product.id})">
                        <i data-lucide="shopping-bag"></i> Add to Cart
                    </button>
                </div>
            `;
            lucide.createIcons();
        } else if (container) {
            container.innerHTML = "<h2>Product not found</h2>";
        }
    }

    // Cart Logic
    if (path.includes('cart')) {
        renderCart();
    }

    // Checkout Logic
    if (path.includes('checkout')) {
        const totalEl = document.getElementById('checkout-total-amount');
        if(totalEl) totalEl.textContent = formatPrice(getCartTotal());

        const form = document.getElementById('checkout-form');
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                cart = [];
                saveCart();
                window.location.href = 'thankyou.html';
            });
        }
    }
});

function renderCart() {
    const container = document.getElementById('cart-page-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="glass-card p-6 center" style="grid-column: span 2;">
                <h2>Your Cart is Empty</h2>
                <a href="products.html" class="btn btn-primary" style="margin-top:20px">Start Shopping</a>
            </div>
        `;
        return;
    }

    const itemsHtml = cart.map(item => `
        <div class="glass-card cart-item">
            <img src="${item.image}" class="cart-img">
            <div style="flex-grow: 1;">
                <h3>${item.name}</h3>
                <p style="color: #60a5fa;">${formatPrice(item.price)}</p>
            </div>
            <div class="cart-controls">
                <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                <span class="qty-val">${item.qty}</span>
                <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
            <button onclick="removeItem(${item.id})" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i data-lucide="trash-2"></i></button>
            <div style="font-weight:bold; width: 120px; text-align: right;">
                ${formatPrice(item.price * item.qty)}
            </div>
        </div>
    `).join('');

    const total = getCartTotal();

    container.innerHTML = `
        <div class="cart-items">${itemsHtml}</div>
        <div class="glass-card p-6" style="height: fit-content;">
            <h2>Order Summary</h2>
            <div class="summary-row"><span>Subtotal</span> <span>${formatPrice(total)}</span></div>
            <div class="summary-row"><span>Shipping</span> <span>LKR 0.00</span></div>
            <div class="summary-total"><span>Total</span> <span>${formatPrice(total)}</span></div>
            <a href="checkout.html" class="btn btn-primary full" style="margin-top: 20px; justify-content: center; text-decoration:none; display:flex;">Proceed to Checkout</a>
        </div>
    `;
    lucide.createIcons();
}
