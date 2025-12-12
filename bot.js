const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const productsDatabase = require('./database.js');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://your-app-name.herokuapp.com';

// Проверка токена
if (!TOKEN) {
    console.error('❌ Токен бота не найден!');
    process.exit(1);
}

// Инициализация Express
const app = express();
app.use(express.json());

// Инициализация бота без polling
const bot = new TelegramBot(TOKEN);

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

    // Пропускаем служебные команды
    if (text.startsWith('/')) return;

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
                console.error('Ошибка отправки фото:', e.message);
                bot.sendMessage(chatId, text + `\n\n📸 [Фото товара](${product.image})`, {
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
    
    // Ответ на callback запрос (убирает часики)
    await bot.answerCallbackQuery(callbackQuery.id);
});

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error('Polling error:', error.code, error.message);
});

bot.on('webhook_error', (error) => {
    console.error('Webhook error:', error);
});

// ========== ВЕБХУК ЭНДПОИНТ ==========
app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Добавляем тестовый endpoint для проверки
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        service: 'Telegram Confectionery Bot',
        shop: SHOP_INFO.name,
        endpoints: {
            webhook: `/bot${TOKEN.substring(0, 15)}...`,
            health: '/health'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Настройка вебхука
async function setupWebhook() {
    try {
        console.log('🔄 Настройка вебхука...');
        
        // Удаляем старый вебхук
        await bot.deleteWebHook();
        console.log('✅ Старый вебхук удален');
        
        // Устанавливаем новый
        const webhookUrl = `${WEBHOOK_URL}/bot${TOKEN}`;
        console.log(`🌐 Установка вебхука на: ${webhookUrl}`);
        
        const webhookResult = await bot.setWebHook(webhookUrl);
        
        if (webhookResult) {
            console.log('✅ Вебхук установлен успешно');
            
            // Проверяем информацию о вебхуке
            const webhookInfo = await bot.getWebHookInfo();
            console.log('📊 Информация о вебхуке:');
            console.log(`   URL: ${webhookInfo.url || 'не установлен'}`);
            console.log(`   Ожидает обновлений: ${webhookInfo.pending_update_count || 0}`);
            console.log(`   Последняя ошибка: ${webhookInfo.last_error_message || 'нет'}`);
        } else {
            console.log('❌ Ошибка установки вебхука');
        }
    } catch (error) {
        console.error('❌ Ошибка при настройке вебхука:', error.message);
    }
}

// Запуск сервера
app.listen(PORT, async () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🤖 Токен бота: ${TOKEN.substring(0, 15)}...`);
    console.log(`🏪 Магазин: ${SHOP_INFO.name}`);
    console.log(`📞 Телефон: ${SHOP_INFO.phone}`);
    
    // Получаем информацию о боте
    try {
        const botInfo = await bot.getMe();
        console.log(`✅ Бот: @${botInfo.username} (${botInfo.first_name})`);
        
        // Настраиваем вебхук
        if (WEBHOOK_URL && WEBHOOK_URL !== 'https://your-app-name.herokuapp.com') {
            await setupWebhook();
        } else {
            console.log('⚠️  WEBHOOK_URL не установлен, использую polling');
            bot.startPolling();
        }
    } catch (error) {
        console.error('❌ Ошибка при получении информации о боте:', error.message);
        console.error('Проверьте правильность токена!');
        
        // Пробуем запустить polling
        console.log('🔄 Пробую запустить polling...');
        bot.startPolling();
    }
});

// Корневой endpoint для проверки
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>Кондитерский бот</title></head>
            <body>
                <h1>🤖 Кондитерский Telegram бот работает!</h1>
                <p>Магазин: ${SHOP_INFO.name}</p>
                <p>Телефон: ${SHOP_INFO.phone}</p>
                <p>Статус: <strong>Online</strong></p>
                <p><a href="/health">Проверить здоровье сервиса</a></p>
            </body>
        </html>
    `);
});

// Экспорт для тестов
module.exports = app;
