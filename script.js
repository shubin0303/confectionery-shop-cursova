// Глобальные переменные
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadProducts();
    
    // Инициализация корзины
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }
    
    // Закрытие корзины при клике вне ее
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCart();
        }
    });
});

// Загрузка товаров
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        
        // Отображение популярных товаров на главной
        displayFeaturedProducts();
        
        // Отображение всех товаров на странице каталога
        if (window.location.pathname.includes('products.html')) {
            displayAllProducts();
        }
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

// Отображение популярных товаров
function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    // Берем первые 4 товара
    const featured = products.slice(0, 4);
    
    container.innerHTML = featured.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} руб.</div>
                <span class="product-stock ${getStockClass(product.stock)}">
                    ${getStockText(product.stock)}
                </span>
                <button class="btn" onclick="addToCart(${product.id})" 
                    ${product.stock === 0 ? 'disabled' : ''}>
                    Добавить в корзину
                </button>
            </div>
        </div>
    `).join('');
}

// Отображение всех товаров
function displayAllProducts() {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-details">
                    <p><strong>Категория:</strong> ${product.category}</p>
                    <p><strong>Вес:</strong> ${product.weight} г</p>
                    <p><strong>Состав:</strong> ${product.composition}</p>
                </div>
                <div class="product-price">${product.price} руб.</div>
                <span class="product-stock ${getStockClass(product.stock)}">
                    ${getStockText(product.stock)}
                </span>
                <button class="btn" onclick="addToCart(${product.id})" 
                    ${product.stock === 0 ? 'disabled' : ''}>
                    Добавить в корзину
                </button>
            </div>
        </div>
    `).join('');
}

// Класс для отображения наличия
function getStockClass(stock) {
    if (stock > 10) return 'in-stock';
    if (stock > 0) return 'low-stock';
    return 'out-of-stock';
}

// Текст для отображения наличия
function getStockText(stock) {
    if (stock > 10) return 'В наличии';
    if (stock > 0) return 'Мало в наличии';
    return 'Нет в наличии';
}

// Корзина
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('Недостаточно товара на складе');
            return;
        }
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Товар добавлен в корзину');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

function updateCartModal() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Корзина пуста</p>';
        if (totalElement) totalElement.textContent = '0';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price} руб. × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
            </div>
        </div>
    `).join('');
    
    if (totalElement) {
        totalElement.textContent = total;
    }
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    const product = products.find(p => p.id === productId);
    
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.stock) {
        alert('Недостаточно товара на складе');
        return;
    }
    
    item.quantity = newQuantity;
    updateCart();
}

function openCart() {
    updateCartModal();
    document.getElementById('cartModal').style.display = 'flex';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }
    
    // Проверяем наличие товаров
    for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (!product || product.stock < item.quantity) {
            alert(`Товар "${item.name}" недоступен в нужном количестве`);
            return;
        }
    }
    
    // Сохраняем заказ
    const order = {
        date: new Date().toISOString(),
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    localStorage.setItem('currentOrder', JSON.stringify(order));
    
    // Перенаправляем на страницу оформления
    window.location.href = 'order.html';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Инициализация карты
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Координаты магазина (Москва)
    const shopLocation = { lat: 55.7558, lng: 37.6173 };
    
    // Создание карты
    const map = new google.maps.Map(mapContainer, {
        zoom: 15,
        center: shopLocation,
        styles: [
            {
                "featureType": "poi.business",
                "stylers": [{ "visibility": "off" }]
            }
        ]
    });
    
    // Добавление маркера
    new google.maps.Marker({
        position: shopLocation,
        map: map,
        title: 'Кондитерская "Сладкая радость"',
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
    });
    
    // Инфоокно
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px;">
                <h3 style="margin: 0 0 10px 0;">Кондитерская "Сладкая радость"</h3>
                <p style="margin: 0;">ул. Сладкая, 15</p>
                <p style="margin: 0;">Часы работы: 8:00-21:00</p>
            </div>
        `
    });
    
    // Открытие инфоокна при клике на маркер
    google.maps.event.addListener(map, 'click', function() {
        infoWindow.open(map);
    });
}

// Обработка формы заказа
function submitOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderData = {
        customer: {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address')
        },
        delivery: {
            date: formData.get('delivery-date'),
            time: formData.get('delivery-time'),
            type: formData.get('delivery-type')
        },
        payment: formData.get('payment-method'),
        comment: formData.get('comments')
    };
    
    // Получаем товары из корзины
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = JSON.parse(localStorage.getItem('currentOrder'))?.total || 0;
    
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }
    
    // Сохраняем полный заказ
    const fullOrder = {
        ...orderData,
        items: cart,
        total: total,
        orderDate: new Date().toISOString(),
        status: 'pending'
    };
    
    // Сохраняем в localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(fullOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Очищаем корзину
    localStorage.removeItem('cart');
    localStorage.removeItem('currentOrder');
    cart.length = 0;
    updateCartCount();
    
    // Показываем подтверждение
    alert('Заказ успешно оформлен! Мы свяжемся с вами для подтверждения.');
    
    // Перенаправляем на главную
    window.location.href = 'index.html';
}