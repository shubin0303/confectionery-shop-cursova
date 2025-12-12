// Функция для загрузки товаров из JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

// Функция для отображения товаров
function displayProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price} ₽</p>
                <p class="${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    ${product.inStock ? 'В наличии' : 'Нет в наличии'}
                </p>
                ${product.inStock ? 
                    `<button onclick="orderProduct('${product.id}')" class="btn">Заказать</button>` : 
                    '<p style="color: #999;">Скоро будет</p>'
                }
            </div>
        </div>
    `).join('');
}

// Функция для заказа товара
function orderProduct(productId) {
    sessionStorage.setItem('selectedProduct', productId);
    window.location.href = 'order.html';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли контейнер для товаров
    if (document.getElementById('products-container')) {
        loadProducts();
    }
    
    // Инициализация карты на странице контактов
    if (document.getElementById('contact-map')) {
        initMap();
    }
});

// Функция инициализации карты
function initMap() {
    const mapContainer = document.getElementById('contact-map');
    if (!mapContainer) return;

    // Координаты магазина (пример)
    const shopLocation = { lat: 55.7558, lng: 37.6173 }; // Москва
    
    const mapHtml = `
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.3737897172285!2d37.61763331593076!3d55.75582600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a5a738fa419%3A0x7c347d506b52311f!2z0JzQvtGB0LrQstCw!5e0!3m2!1sru!2sru!4v1647851234567!5m2!1sru!2sru"
            class="map"
            allowfullscreen=""
            loading="lazy">
        </iframe>
    `;
    
    mapContainer.innerHTML = mapHtml;
}
