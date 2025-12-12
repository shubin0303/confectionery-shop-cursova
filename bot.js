const TelegramBot = require('node-telegram-bot-api');
const productsDatabase = require('./products.js');

// === ВНИМАНИЕ! НАСТРОЙКА ТОКЕНА ===
// НАШ ТОКЕН БУДЕТ АВТОМАТИЧЕСКИ ПОДСТАВЛЕН ИЗ СЕКРЕТОВ GITHUB
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Проверка токена
if (!TOKEN) {
    console.error('❌ ОШИБКА: Токен бота не найден!');
    console.error('Добавьте секрет TELEGRAM_BOT_TOKEN в GitHub Secrets');
    process.exit(1);
}

// Конфигурация магазина
const SHOP_INFO = {
    name: "Сладкая Радость",
    description: "Кондитерская с 10-летним опытом. Мы используем только натуральные ингредиенты!",
    website: "https://sweet-joy.example.com",
    deliveryInfo: "https://sweet-joy.example.com/delivery",
    orderInfo: "https://sweet-joy.example.com/how-to-order",
    location: { latitude: 55.7558, longitude: 37.6173 },
    address: "г. Москва, ул. Сладкая, д. 10",
    phone: "+7 (999) 123-45-67",
    workingHours: "Ежедневно с 9:00 до 21:00"
};

const CATEGORIES = {
    cake: "🎂 Торты",
    pastry: "🍰 Пирожные", 
    cupcake: "🧁 Капкейки",
    macaron: "🥯 Макаруны",
    all: "📋 Все товары"
};

// Инициализация бота с polling
const bot = new TelegramBot(TOKEN, { 
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});

console.log('✅ Бот кондитерской запущен через GitHub Actions!');
console.log(`🤖 Имя бота: ${SHOP_INFO.name}`);
console.log(`📞 Телефон: ${SHOP_INFO.phone}`);

// Главное меню
const mainMenu = {
    reply_markup: {
        keyboard: [
            ['🏪 О магазине', '📦 Наши товары'],
            ['📍 Мы на карте', '🌐 Наш сайт'],
            ['🛒 Как заказать', '📞 Контакты']
        ],
        resize_keyboard: true
    }
};

// Меню категорий  
const categoriesMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: CATEGORIES.cake, callback_data: 'category_cake' }],
            [{ text: CATEGORIES.pastry, callback_data: 'category_pastry' }],
            [{ text: CATEGORIES.cupcake, callback_data: 'category_cupcake' }],
            [{ text: CATEGORIES.macaron, callback_data: 'category_macaron' }],
            [{ text: CATEGORIES.all, callback_data: 'category_all' }]
        ]
    }
};

// Обработчик /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeText = `🎂 Добро пожаловать в кондитерскую "${SHOP_INFO.name}"!\n\nВыберите действие:`;
    bot.sendMessage(chatId, welcomeText, mainMenu);
});

// Обработчик текстовых сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '🏪 О магазине') {
        bot.sendMessage(chatId, 
            `🏪 *${SHOP_INFO.name}*\n\n${SHOP_INFO.description}\n\n📍 *Адрес:* ${SHOP_INFO.address}\n📞 *Телефон:* ${SHOP_INFO.phone}\n⏰ *Часы работы:* ${SHOP_INFO.workingHours}`,
            { parse_mode: 'Markdown' }
        );
    } 
    else if (text === '📦 Наши товары') {
        bot.sendMessage(chatId, "📦 *Выберите категорию:*", {
            parse_mode: 'Markdown',
            ...categoriesMenu
        });
    }
    else if (text === '📍 Мы на карте') {
        bot.sendLocation(chatId, SHOP_INFO.location.latitude, SHOP_INFO.location.longitude);
        bot.sendMessage(chatId, `📍 *Наш адрес:*\n${SHOP_INFO.address}\n\n[Открыть в Google Maps](https://maps.google.com/?q=${SHOP_INFO.location.latitude},${SHOP_INFO.location.longitude})`, {
            parse_mode: 'Markdown'
        });
    }
    else if (text === '🌐 Наш сайт') {
        bot.sendMessage(chatId, `🌐 *Наш сайт:*\n${SHOP_INFO.website}\n\n[Перейти на сайт](${SHOP_INFO.website})`, {
            parse_mode: 'Markdown'
        });
    }
    else if (text === '🛒 Как заказать') {
        bot.sendMessage(chatId,
            `🛒 *Как заказать:*\n\n1. Выберите товары\n2. Позвоните нам: ${SHOP_INFO.phone}\n3. Или оформите на сайте\n\n🚚 *Доставка:* 300 руб. (бесплатно от 3000 руб.)\n💳 *Оплата:* наличные/карта\n\n[Подробнее о доставке](${SHOP_INFO.deliveryInfo})`,
            { parse_mode: 'Markdown' }
        );
    }
    else if (text === '📞 Контакты') {
        bot.sendMessage(chatId,
            `📞 *Контакты:*\n\n📱 Телефон: ${SHOP_INFO.phone}\n📍 Адрес: ${SHOP_INFO.address}\n⏰ Часы: ${SHOP_INFO.workingHours}\n✉️ Email: info@sweet-joy.example.com`,
            { parse_mode: 'Markdown' }
        );
    }
});

// Обработчик inline кнопок
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data.startsWith('category_')) {
        const category = data.split('_')[1];
        const products = productsDatabase.getProductsByCategory(category);
        
        if (products.length === 0) {
            bot.sendMessage(chatId, 'Товаров в этой категории пока нет.');
            return;
        }

        let message = `📦 *${CATEGORIES[category] || 'Все товары'}*\n\n`;
        const keyboard = [];
        
        products.forEach(product => {
            const emoji = product.availability ? '✅' : '❌';
            message += `${emoji} *${product.name}* - ${product.price} руб.\n`;
            keyboard.push([{ 
                text: `${product.name} - ${product.price} руб.`, 
                callback_data: `product_${product.id}` 
            }]);
        });
        
        keyboard.push([{ text: '🔙 Назад', callback_data: 'back_to_categories' }]);
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: keyboard }
        });
    }
    else if (data.startsWith('product_')) {
        const productId = parseInt(data.split('_')[1]);
        const product = productsDatabase.getProductById(productId);
        
        if (product) {
            const status = product.availability ? '✅ В наличии' : '❌ Нет в наличии';
            const text = `*${product.name}*\n\n📝 ${product.description}\n💰 Цена: ${product.price} руб.\n⚖️ Вес: ${product.weight}\n📦 ${status}\n\nСостав: ${product.ingredients.join(', ')}`;
            
            try {
                await bot.sendPhoto(chatId, product.image, {
                    caption: text,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '🔙 Назад к товарам', callback_data: 'back_to_categories' }
                        ]]
                    }
                });
            } catch (e) {
                bot.sendMessage(chatId, text, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '🔙 Назад', callback_data: 'back_to_categories' }
                        ]]
                    }
                });
            }
        }
    }
    else if (data === 'back_to_categories') {
        bot.sendMessage(chatId, "📦 *Выберите категорию:*", {
            parse_mode: 'Markdown',
            ...categoriesMenu
        });
    }
    
    await bot.answerCallbackQuery(callbackQuery.id);
});

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error('Polling error:', error.code);
});

bot.on('webhook_error', (error) => {
    console.error('Webhook error:', error);
});

// Экспорт для тестов
if (typeof module !== 'undefined') {
    module.exports = { bot, SHOP_INFO };
}
