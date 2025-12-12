// Скрипт для страницы продуктов
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupFilters();
});

function loadProducts(category = 'all') {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Получаем продукты из базы данных
    let products;
    if (category === 'all') {
        products = productsDatabase.getAllProducts();
    } else {
        products = productsDatabase.getProductsByCategory(category);
    }
    
    // Проверяем, есть ли продукты
    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-cookie-bite"></i>
                <h3>Товары не найдены</h3>
                <p>Попробуйте выбрать другую категорию</p>
            </div>
        `;
        return;
    }
    
    // Создаем карточки продуктов
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Форматируем цену
    const formattedPrice = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(product.price);
    
    // Создаем HTML для карточки
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'">
        <div class="product-info">
            <div class="product-header">
                <h3>${product.name}</h3>
                <span class="product-price">${formattedPrice}</span>
            </div>
            <div class="product-meta">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <span class="product-weight">${product.weight}</span>
            </div>
            <div class="availability">
                <i class="fas ${product.availability ? 'fa-check-circle available' : 'fa-times-circle unavailable'}"></i>
                <span>${product.availability ? 'В наличии' : 'Нет в наличии'}</span>
            </div>
            <p class="product-description">${product.description}</p>
            <p class="product-ingredients">
                <strong>Состав:</strong> ${product.ingredients.join(', ')}
            </p>
            ${product.availability ? 
                `<button class="btn order-btn" onclick="orderProduct(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Заказать
                </button>` : 
                `<button class="btn" disabled>
                    <i class="fas fa-clock"></i> Скоро в продаже
                </button>`
            }
        </div>
    `;
    
    return card;
}

function getCategoryName(category) {
    const categories = {
        'cake': 'Торт',
        'pastry': 'Пирожное',
        'cupcake': 'Капкейки',
        'macaron': 'Макаруны'
    };
    return categories[category] || category;
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Загружаем продукты выбранной категории
            const category = this.dataset.category;
            loadProducts(category);
        });
    });
}

function orderProduct(productId) {
    const product = productsDatabase.getProductById(productId);
    
    if (!product) {
        alert('Товар не найден');
        return;
    }
    
    if (!product.availability) {
        alert('Этот товар временно отсутствует');
        return;
    }
    
    // Сохраняем выбранный продукт в localStorage
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    
    // Перенаправляем на страницу заказа
    window.location.href = 'order.html';
    
    // Или показываем модальное окно
    // showOrderModal(product);
}

function showOrderModal(product) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const formattedPrice = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(product.price);
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>Заказ ${product.name}</h3>
                <button onclick="this.closest('.order-modal').remove()" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                ">&times;</button>
            </div>
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <img src="${product.image}" alt="${product.name}" style="
                    width: 100%;
                    max-height: 200px;
                    object-fit: cover;
                    border-radius: 10px;
                ">
            </div>
            <p><strong>Цена:</strong> ${formattedPrice}</p>
            <p><strong>Вес:</strong> ${product.weight}</p>
            <p>${product.description}</p>
            <div style="margin-top: 1.5rem;">
                <p>Для оформления заказа позвоните по телефону:</p>
                <p style="font-size: 1.2rem; font-weight: bold; color: #ff6b8b;">
                    <i class="fas fa-phone"></i> +7 (495) 123-45-67
                </p>
            </div>
            <button onclick="window.location.href='order.html'" style="
                width: 100%;
                margin-top: 1rem;
                padding: 1rem;
                background: #ff6b8b;
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                cursor: pointer;
            ">
                Перейти к оформлению заказа
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие модального окна по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Обработчик для кнопок заказа
document.addEventListener('click', function(e) {
    if (e.target.closest('.order-btn')) {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Здесь можно добавить логику добавления в корзину
        alert(`Товар "${productName}" добавлен в список для заказа! Позвоните нам для оформления.`);
    }
});

// Инициализация при загрузке страницы
window.onload = function() {
    // Проверяем, есть ли выбранный продукт в localStorage
    const selectedProduct = localStorage.getItem('selectedProduct');
    if (selectedProduct && window.location.pathname.includes('order.html')) {
        const product = JSON.parse(selectedProduct);
        // Можно показать информацию о выбранном продукте на странице заказа
        console.log('Выбранный продукт:', product);
        localStorage.removeItem('selectedProduct');
    }
};
