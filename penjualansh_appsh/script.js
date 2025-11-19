
const SELLER_WHATSAPP_NUMBER = '6281335235999'; // Contoh nomor
const API_URL = 'api/api.php?action=get_products';

function formatPrice(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

async function fetchProducts() {
    showPageLoader(true);
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Gagal mengambil produk');
        const products = await res.json();
        renderProducts(products);
    } catch (err) {
        document.getElementById('product-list').innerHTML = `<p class="error">${err.message}</p>`;
    } finally {
        showPageLoader(false);
    }
}

function renderProducts(products) {
    const container = document.getElementById('product-list');
    if (!container) return;
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
            <a href="product-detail.html?id=${product.id}" style="text-decoration:none;color:inherit;display:block;height:100%">
                <img src="${product.image || 'img/no-image.png'}" alt="${escapeHtml(product.title)}" class="product-image" />
                <div class="product-body">
                    <h3 class="product-title">${escapeHtml(product.title)}</h3>
                    <p class="product-price">${formatPrice(product.price)}</p>
                    <p class="product-desc">${escapeHtml((product.description || '').substring(0, 120))}</p>
                    <div class="product-actions">
                        <button class="add-to-cart-btn" data-product-id="${product.id}">Tambah</button>
                    </div>
                </div>
            </a>
        `;
        container.appendChild(card);
    });
    attachAddToCartHandlers();
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(productId) {
    const cart = getCart();
    const found = cart.find(i => i.id === productId);
    if (found) found.qty += 1;
    else cart.push({ id: productId, qty: 1 });
    saveCart(cart);
}

function attachAddToCartHandlers() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-product-id')) || 0;
            if (id) {
                addToCart(id);
                btn.textContent = '✓ Ditambahkan';
                setTimeout(() => btn.textContent = 'Tambah', 1200);
            }
        });
    });
}

function updateCartBadge() {
    const count = getCart().reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

function showPageLoader(visible) {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.style.display = visible ? 'flex' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    // Load footer partial if container exists
    const footerContainer = document.getElementById('site-footer');
    if (footerContainer) {
        fetch('footer.html')
            .then(r => r.text())
            .then(html => footerContainer.innerHTML = html)
            .catch(() => {});
    }
    fetchProducts();
});


