const TelegramBot = require('node-telegram-bot-api');
const productsDatabase = require('./database.js');

// Конфигурация магазина
const SHOP_INFO = {
    name: "Сладкая Радость",
    description: "Кондитерская с 10-летним опытом создания вкуснейших десертов. Мы используем только натуральные ингредиенты и готовим с любовью!",
    website: "https://sweet-joy.example.com",
    deliveryInfo: "https://sweet-joy.example.com/delivery",
    orderInfo: "https://sweet-joy.example.com/how-to-order",
    location: {
        latitude: 55.7558,
        longitude: 37.6173
    },
    address: "г. Москва, ул. Сладкая, д. 10",
    phone: "+7 (999) 123-45-67",
    workingHours: "Ежедневно с 9:00 до 21:00"
};

// Категории продуктов
const CATEGORIES = {
    cake: "🎂 Торты",
    pastry: "🍰 Пирожные",
    cupcake: "🧁 Капкейки",
    macaron: "🥯 Макаруны",
    all: "📋 Все товары"
};

// Инициализация бота
const TOKEN = '8391855356:AAH60-FveCFiorVqG0aWLsK3MGj51zoD9n0'; // Замените на ваш токен
const bot = new TelegramBot(TOKEN, { polling: true });

console.log('Бот кондитерской запущен...');

// Главное меню
const mainMenu = {
    reply_markup: {
        keyboard: [
            ['🏪 О магазине', '📦 Наши товары'],
            ['📍 Мы на карте', '🌐 Наш сайт'],
            ['🛒 Как заказать', '📞 Контакты']
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

// Меню категорий
const categoriesMenu = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: CATEGORIES.cake, callback_data: 'category_cake' },
                { text: CATEGORIES.pastry, callback_data: 'category_pastry' }
            ],
            [
                { text: CATEGORIES.cupcake, callback_data: 'category_cupcake' },
                { text: CATEGORIES.macaron, callback_data: 'category_macaron' }
            ],
            [
                { text: CATEGORIES.all, callback_data: 'category_all' }
            ]
        ]
    }
};

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeText = `🎂 Добро пожаловать в кондитерскую "${SHOP_INFO.name}"!\n\n` +
                       `Я ваш помощник по выбору вкуснейших десертов.\n\n` +
                       `Выберите действие из меню ниже:`;
    
    bot.sendMessage(chatId, welcomeText, mainMenu);
});

// Обработчик текстовых сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    switch(text) {
        case '🏪 О магазине':
            sendShopInfo(chatId);
            break;
        case '📦 Наши товары':
            sendCategories(chatId);
            break;
        case '📍 Мы на карте':
            sendLocation(chatId);
            break;
        case '🌐 Наш сайт':
            sendWebsite(chatId);
            break;
        case '🛒 Как заказать':
            sendOrderInfo(chatId);
            break;
        case '📞 Контакты':
            sendContacts(chatId);
            break;
    }
});

// Обработчик inline кнопок
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;
    const data = callbackQuery.data;

    if (data.startsWith('category_')) {
        const category = data.split('_')[1];
        showProductsByCategory(chatId, category);
    } else if (data.startsWith('product_')) {
        const productId = parseInt(data.split('_')[1]);
        showProductDetails(chatId, productId);
    } else if (data === 'back_to_categories') {
        sendCategories(chatId);
    }
});

// Функция отправки информации о магазине
function sendShopInfo(chatId) {
    const shopInfoText = `🏪 *${SHOP_INFO.name}*\n\n` +
                        `${SHOP_INFO.description}\n\n` +
                        `*Адрес:* ${SHOP_INFO.address}\n` +
                        `*Телефон:* ${SHOP_INFO.phone}\n` +
                        `*Часы работы:* ${SHOP_INFO.workingHours}\n\n` +
                        `Мы специализируемся на:\n` +
                        `• Авторских тортах\n` +
                        `• Классических пирожных\n` +
                        `• Капкейках на заказ\n` +
                        `• Французских макарунах\n\n` +
                        `Все продукты готовятся ежедневно!`;
    
    bot.sendMessage(chatId, shopInfoText, { parse_mode: 'Markdown' });
}

// Функция отправки меню категорий
function sendCategories(chatId) {
    const categoriesText = `📦 *Выберите категорию товаров:*\n\n` +
                          `У нас есть ${productsDatabase.products.length} видов десертов!\n` +
                          `Из них доступно: ${productsDatabase.getAvailableProducts().length}`;
    
    bot.sendMessage(chatId, categoriesText, {
        parse_mode: 'Markdown',
        ...categoriesMenu
    });
}

// Функция показа товаров по категории
function showProductsByCategory(chatId, category) {
    const products = productsDatabase.getProductsByCategory(category);
    const categoryName = CATEGORIES[category] || 'Все товары';
    
    if (products.length === 0) {
        bot.sendMessage(chatId, 'В этой категории пока нет товаров.');
        return;
    }

    // Создаем inline клавиатуру с товарами
    const productKeyboard = [];
    products.forEach(product => {
        const emoji = product.availability ? '✅' : '❌';
        productKeyboard.push([
            {
                text: `${emoji} ${product.name} - ${product.price} руб.`,
                callback_data: `product_${product.id}`
            }
        ]);
    });

    // Добавляем кнопку "Назад"
    productKeyboard.push([
        { text: '🔙 Назад к категориям', callback_data: 'back_to_categories' }
    ]);

    const productsText = `${categoryName}\n\n` +
                        `*Найдено товаров:* ${products.length}\n` +
                        `*Доступно:* ${products.filter(p => p.availability).length}`;

    bot.sendMessage(chatId, productsText, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: productKeyboard
        }
    });
}

// Функция показа деталей товара
function showProductDetails(chatId, productId) {
    const product = productsDatabase.getProductById(productId);
    
    if (!product) {
        bot.sendMessage(chatId, 'Товар не найден.');
        return;
    }

    const availabilityText = product.availability ? 
        `✅ *В наличии*` : 
        `❌ *Нет в наличии*`;
    
    const productText = `*${product.name}*\n\n` +
                       `${product.description}\n\n` +
                       `*Цена:* ${product.price} руб.\n` +
                       `*Вес:* ${product.weight}\n` +
                       `*Состав:* ${product.ingredients.join(', ')}\n\n` +
                       `${availabilityText}\n\n` +
                       `[Посмотреть фото](${product.image})`;

    const backButton = {
        reply_markup: {
            inline_keyboard: [[
                { text: '🔙 Назад к товарам', callback_data: 'back_to_categories' }
            ]]
        }
    };

    // Отправляем фото и описание
    bot.sendPhoto(chatId, product.image, {
        caption: productText,
        parse_mode: 'Markdown',
        ...backButton
    }).catch(() => {
        // Если не удалось отправить фото, отправляем только текст
        bot.sendMessage(chatId, productText, {
            parse_mode: 'Markdown',
            ...backButton
        });
    });
}

// Функция отправки местоположения
function sendLocation(chatId) {
    const locationText = `📍 *Наш адрес:*\n${SHOP_INFO.address}\n\n` +
                        `Нажмите на кнопку ниже, чтобы открыть карту:`;
    
    const locationKeyboard = {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '🗺️ Открыть в Google Maps',
                    url: `https://www.google.com/maps?q=${SHOP_INFO.location.latitude},${SHOP_INFO.location.longitude}`
                }
            ]]
        }
    };

    bot.sendMessage(chatId, locationText, {
        parse_mode: 'Markdown',
        ...locationKeyboard
    });
    
    // Также отправляем локацию для быстрого доступа
    bot.sendLocation(chatId, SHOP_INFO.location.latitude, SHOP_INFO.location.longitude);
}

// Функция отправки сайта
function sendWebsite(chatId) {
    const websiteText = `🌐 *Наш официальный сайт*\n\n` +
                       `На сайте вы найдете:\n` +
                       `• Полный каталог товаров\n` +
                       `• Акции и скидки\n` +
                       `• Отзывы клиентов\n` +
                       `• Блог о кондитерском искусстве`;
    
    const websiteKeyboard = {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: 'Перейти на сайт',
                    url: SHOP_INFO.website
                }
            ]]
        }
    };

    bot.sendMessage(chatId, websiteText, {
        parse_mode: 'Markdown',
        ...websiteKeyboard
    });
}

// Функция отправки информации о заказе
function sendOrderInfo(chatId) {
    const orderText = `🛒 *Как сделать заказ:*\n\n` +
                     `1. Выберите товары через нашего бота\n` +
                     `2. Перейдите на наш сайт для оформления заказа\n` +
                     `3. Или позвоните нам по телефону\n\n` +
                     `*Доставка:*\n` +
                     `• По городу: 300 руб.\n` +
                     `• При заказе от 3000 руб. - бесплатно\n` +
                     `• Самовывоз: бесплатно\n\n` +
                     `*Оплата:*\n` +
                     `• Наличными\n` +
                     `• Картой онлайн\n` +
                     `• Переводом`;
    
    const orderKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '📋 Подробнее о доставке',
                        url: SHOP_INFO.deliveryInfo
                    },
                    {
                        text: '🛍️ Как заказать на сайте',
                        url: SHOP_INFO.orderInfo
                    }
                ],
                [
                    {
                        text: '📞 Заказать по телефону',
                        callback_data: 'call_phone'
                    }
                ]
            ]
        }
    };

    bot.sendMessage(chatId, orderText, {
        parse_mode: 'Markdown',
        ...orderKeyboard
    });
}

// Функция отправки контактов
function sendContacts(chatId) {
    const contactsText = `📞 *Контакты кондитерской:*\n\n` +
                        `*Телефон:* ${SHOP_INFO.phone}\n` +
                        `*Адрес:* ${SHOP_INFO.address}\n` +
                        `*Часы работы:* ${SHOP_INFO.workingHours}\n\n` +
                        `*Электронная почта:* info@sweet-joy.example.com\n\n` +
                        `Мы в соцсетях:`;
    
    const contactsKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '📱 WhatsApp',
                        url: `https://wa.me/${SHOP_INFO.phone.replace(/\D/g, '')}`
                    },
                    {
                        text: '📧 Email',
                        url: 'mailto:info@sweet-joy.example.com'
                    }
                ],
                [
                    {
                        text: '📷 Instagram',
                        url: 'https://instagram.com/sweet_joy_example'
                    },
                    {
                        text: '📘 VK',
                        url: 'https://vk.com/sweet_joy_example'
                    }
                ]
            ]
        }
    };

    bot.sendMessage(chatId, contactsText, {
        parse_mode: 'Markdown',
        ...contactsKeyboard
    });
}

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.log('Ошибка polling:', error);
});

bot.on('webhook_error', (error) => {
    console.log('Ошибка webhook:', error);
});
