// Генерация данных о товарах
function generateProducts() {
    const products = [
        {
            id: 1,
            name: 'Торт "Красный бархат"',
            category: 'Торты',
            description: 'Нежный бисквит с кремом из сливочного сыра',
            price: 2500,
            weight: 2000,
            stock: 15,
            composition: 'мука, сахар, масло сливочное, сыр творожный, яйца, крем-сыр, красители натуральные',
            image: 'images/cake1.jpg',
            featured: true
        },
        {
            id: 2,
            name: 'Пирожное "Картошка"',
            category: 'Пирожные',
            description: 'Классическое пирожное по бабушкиному рецепту',
            price: 120,
            weight: 100,
            stock: 50,
            composition: 'печенье, масло сливочное, сахар, какао, грецкие орехи',
            image: 'images/cake2.jpg',
            featured: true
        },
        {
            id: 3,
            name: 'Тирамису',
            category: 'Десерты',
            description: 'Итальянский десерт с кофе и маскарпоне',
            price: 350,
            weight: 150,
            stock: 20,
            composition: 'сыр маскарпоне, кофе, яйца, сахар, печенье савоярди, какао',
            image: 'images/cake3.jpg',
            featured: true
        },
        {
            id: 4,
            name: 'Макаруны ассорти',
            category: 'Печенье',
            description: 'Французское миндальное печенье с различными начинками',
            price: 1800,
            weight: 250,
            stock: 30,
            composition: 'миндальная мука, сахарная пудра, яичные белки, сливочный крем, пищевые красители',
            image: 'images/cake4.jpg',
            featured: true
        },
        {
            id: 5,
            name: 'Чизкейк Нью-Йорк',
            category: 'Торты',
            description: 'Классический чизкейк с ягодным соусом',
            price: 2200,
            weight: 1500,
            stock: 8,
            composition: 'сыр сливочный, сливки, яйца, сахар, печенье, масло сливочное',
            image: 'images/cake5.jpg',
            featured: false
        },
        {
            id: 6,
            name: 'Эклеры с заварным кремом',
            category: 'Пирожные',
            description: 'Воздушное заварное тесто с нежным кремом',
            price: 150,
            weight: 80,
            stock: 40,
            composition: 'мука, масло, яйца, молоко, сахар, ваниль',
            image: 'images/cake6.jpg',
            featured: false
        },
        {
            id: 7,
            name: 'Медовик',
            category: 'Торты',
            description: 'Медовый торт со сметанным кремом',
            price: 1900,
            weight: 1800,
            stock: 12,
            composition: 'мука, мед, яйца, сметана, сахар, масло сливочное',
            image: 'images/cake7.jpg',
            featured: false
        },
        {
            id: 8,
            name: 'Трюфели шоколадные',
            category: 'Конфеты',
            description: 'Шоколадные конфеты ручной работы',
            price: 900,
            weight: 200,
            stock: 25,
            composition: 'шоколад темный, сливки, масло какао, коньяк, какао-порошок',
            image: 'images/cake8.jpg',
            featured: false
        },
        {
            id: 9,
            name: 'Торт "Птичье молоко"',
            category: 'Торты',
            description: 'Воздушный суфлейный торт в шоколадной глазури',
            price: 2700,
            weight: 2200,
            stock: 6,
            composition: 'яичные белки, желатин, сливки, шоколад, сахар',
            image: 'images/cake9.jpg',
            featured: false
        },
        {
            id: 10,
            name: 'Пончики с глазурью',
            category: 'Выпечка',
            description: 'Свежие пончики с различными видами глазури',
            price: 80,
            weight: 70,
            stock: 60,
            composition: 'мука, дрожжи, молоко, сахар, масло растительное, глазурь',
            image: 'images/cake10.jpg',
            featured: false
        },
        {
            id: 11,
            name: 'Торт "Наполеон"',
            category: 'Торты',
            description: 'Слоеный торт с заварным кремом',
            price: 2100,
            weight: 2000,
            stock: 10,
            composition: 'мука, масло сливочное, яйца, молоко, сахар, ваниль',
            image: 'images/cake11.jpg',
            featured: false
        },
        {
            id: 12,
            name: 'Брауни с орехами',
            category: 'Десерты',
            description: 'Шоколадный брауни с грецкими орехами',
            price: 280,
            weight: 120,
            stock: 35,
            composition: 'шоколад темный, масло сливочное, яйца, сахар, мука, орехи грецкие',
            image: 'images/cake12.jpg',
            featured: false
        }
    ];

    // Сохраняем в localStorage как резерв
    localStorage.setItem('products_backup', JSON.stringify(products));
    
    // Сохраняем в файл products.json (для демонстрации создаем в памяти)
    console.log('Сгенерировано товаров:', products.length);
    
    // Для реального использования нужно создать файл data/products.json
    // и заполнить его данными выше
    
    return products;
}

// Инициализация данных при первой загрузке
function initDatabase() {
    if (!localStorage.getItem('products_initialized')) {
        console.log('Инициализация базы данных...');
        const products = generateProducts();
        
        // Сохраняем в localStorage для демонстрации
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('products_initialized', 'true');
        localStorage.setItem('cart', JSON.stringify([]));
        localStorage.setItem('orders', JSON.stringify([]));
        
        console.log('База данных инициализирована');
    }
}

// Вызываем инициализацию при загрузке
if (typeof window !== 'undefined') {
    initDatabase();
}

// Экспорт для Node.js (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateProducts };
}