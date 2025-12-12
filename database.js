// База данных продуктов кондитерской
const productsDatabase = {
    products: [
        {
            id: 1,
            name: "Торт 'Красный бархат'",
            category: "cake",
            price: 2500,
            weight: "2 кг",
            availability: true,
            description: "Классический американский торт с нежным сливочным кремом",
            ingredients: ["мука", "какао", "сметана", "сливочный сыр", "ваниль"],
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            name: "Торт 'Медовик'",
            category: "cake",
            price: 2200,
            weight: "1.8 кг",
            availability: true,
            description: "Нежный торт на медовых коржах со сметанным кремом",
            ingredients: ["мед", "сметана", "грецкие орехи", "сливки"],
            image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 3,
            name: "Пирожное 'Картошка'",
            category: "pastry",
            price: 180,
            weight: "100 г",
            availability: true,
            description: "Классическое пирожное из печенья и какао",
            ingredients: ["печенье", "какао", "сливочное масло", "орехи"],
            image: "https://images.unsplash.com/photo-1558920558-fb0345e52561?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 4,
            name: "Пирожное 'Эклер'",
            category: "pastry",
            price: 220,
            weight: "120 г",
            availability: true,
            description: "Заварное пирожное с шоколадной глазурью",
            ingredients: ["заварное тесто", "заварной крем", "шоколад"],
            image: "https://images.unsplash.com/photo-1558317180-1f6e31f26d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 5,
            name: "Капкейки 'Ванильные'",
            category: "cupcake",
            price: 350,
            weight: "6 шт",
            availability: true,
            description: "Нежные ванильные капкейки с кремом",
            ingredients: ["ваниль", "сливочный крем", "кондитерская посыпка"],
            image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 6,
            name: "Капкейки 'Шоколадные'",
            category: "cupcake",
            price: 380,
            weight: "6 шт",
            availability: true,
            description: "Шоколадные капкейки с шоколадным кремом",
            ingredients: ["какао", "шоколад", "шоколадный крем"],
            image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 7,
            name: "Макаруны 'Ассорти'",
            category: "macaron",
            price: 1200,
            weight: "12 шт",
            availability: true,
            description: "Набор разноцветных макарунсов с разными начинками",
            ingredients: ["миндальная мука", "яичный белок", "разные начинки"],
            image: "https://images.unsplash.com/photo-1569929238190-869826b1bb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 8,
            name: "Торт 'Прага'",
            category: "cake",
            price: 2800,
            weight: "2.2 кг",
            availability: false,
            description: "Шоколадный торт по классическому рецепту",
            ingredients: ["шоколад", "сливочное масло", "яйца", "сметана"],
            image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 9,
            name: "Пирожное 'Наполеон'",
            category: "pastry",
            price: 240,
            weight: "150 г",
            availability: true,
            description: "Слоеное пирожное с заварным кремом",
            ingredients: ["слоеное тесто", "заварной крем", "сахарная пудра"],
            image: "https://images.unsplash.com/photo-1519861531473-920034658307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 10,
            name: "Пирожное 'Фруктовый тарт'",
            category: "pastry",
            price: 280,
            weight: "130 г",
            availability: true,
            description: "Песочная основа с заварным кремом и свежими фруктами",
            ingredients: ["песочное тесто", "заварной крем", "свежие фрукты"],
            image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 11,
            name: "Торт 'Фруктовый рай'",
            category: "cake",
            price: 3200,
            weight: "2.5 кг",
            availability: true,
            description: "Бисквитный торт с взбитыми сливками и свежими фруктами",
            ingredients: ["бисквит", "взбитые сливки", "клубника", "киви", "персики"],
            image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 12,
            name: "Макаруны 'Шоколадные'",
            category: "macaron",
            price: 150,
            weight: "1 шт",
            availability: true,
            description: "Шоколадные макаруны с шоколадной ганашем",
            ingredients: ["миндальная мука", "шоколад", "какао", "сливки"],
            image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        }
    ],

    // Метод для получения всех продуктов
    getAllProducts: function() {
        return this.products;
    },

    // Метод для получения продуктов по категории
    getProductsByCategory: function(category) {
        if (category === 'all') {
            return this.products;
        }
        return this.products.filter(product => product.category === category);
    },

    // Метод для поиска продукта по ID
    getProductById: function(id) {
        return this.products.find(product => product.id === id);
    },

    // Метод для получения доступных продуктов
    getAvailableProducts: function() {
        return this.products.filter(product => product.availability);
    }
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = productsDatabase;
}
