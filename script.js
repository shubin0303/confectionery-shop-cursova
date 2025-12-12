// Основные скрипты для всех страниц
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    initializePage();
    
    // Обработчики событий
    setupEventListeners();
});

function initializePage() {
    // Инициализация карты
    initMap();
    
    // Инициализация формы консультации
    initConsultationForm();
}

function setupEventListeners() {
    // Обработчик для формы консультации
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', handleConsultationSubmit);
    }
    
    // Мобильное меню
    setupMobileMenu();
}

function initMap() {
    // Это заглушка для карты
    // В реальном проекте здесь будет код Google Maps API или Яндекс.Карт
    console.log('Карта инициализирована');
}

function initConsultationForm() {
    const form = document.getElementById('consultationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            const name = form.querySelector('input[type="text"]').value;
            const phone = form.querySelector('input[type="tel"]').value;
            
            if (!name || !phone) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Здесь можно добавить отправку на сервер
            alert('Спасибо за заявку! Мы свяжемся с вами в течение 15 минут.');
            form.reset();
        });
    }
}

function handleConsultationSubmit(e) {
    e.preventDefault();
    
    // Получаем данные формы
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // В реальном проекте здесь будет отправка на сервер
    console.log('Данные формы:', data);
    
    // Показываем сообщение об успехе
    alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
    
    // Очищаем форму
    form.reset();
    
    return false;
}

function setupMobileMenu() {
    // Создаем кнопку для мобильного меню
    const nav = document.querySelector('nav');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth <= 768 && navMenu) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
        
        nav.appendChild(menuToggle);
        
        // Добавляем стили для мобильного меню
        const style = document.createElement('style');
        style.textContent = `
            .menu-toggle {
                display: none;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            @media (max-width: 768px) {
                .menu-toggle {
                    display: block;
                }
                
                .nav-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #ff6b8b;
                    flex-direction: column;
                    padding: 1rem;
                    z-index: 1000;
                }
                
                .nav-menu.show {
                    display: flex;
                }
                
                .nav-menu li {
                    width: 100%;
                }
                
                .nav-menu a {
                    display: block;
                    padding: 0.5rem 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Функция для форматирования цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}

// Экспорт функций для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        formatPrice,
        handleConsultationSubmit
    };
}
