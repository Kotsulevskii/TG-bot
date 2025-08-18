"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const fs_1 = __importDefault(require("fs"));
const TOKEN = "8040472221:AAFul9EXx3oVtKs93rXEW5z-XS7mX3kP8Qo";
const ADMIN_ID = 123456789; // твой Telegram ID
const bot = new node_telegram_bot_api_1.default(TOKEN, { polling: true });
function loadData() {
    try {
        return JSON.parse(fs_1.default.readFileSync("data.json", "utf8"));
    }
    catch {
        return { "7": {}, "8": {}, "9": {}, "10": {}, "11": {} };
    }
}
function saveData(data) {
    fs_1.default.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf8");
}
let data = loadData();
// ===== Генераторы клавиатур =====
function classKeyboard() {
    return {
        inline_keyboard: [
            [{ text: "7", callback_data: "class:7" }, { text: "8", callback_data: "class:8" }],
            [{ text: "9", callback_data: "class:9" }, { text: "10", callback_data: "class:10" }],
            [{ text: "11", callback_data: "class:11" }]
        ],
    };
}
function themeKeyboard(cls) {
    const themes = Object.keys(data[cls] || {});
    const rows = themes.map((t) => [{ text: t, callback_data: `theme:${cls}:${t}` }]);
    rows.push([{ text: "🔙 Назад", callback_data: "back" }]);
    return { inline_keyboard: rows };
}
// ===== Пользовательская часть =====
// /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Выберите класс:", { reply_markup: classKeyboard() });
});
// Inline кнопки
bot.on("callback_query", (query) => {
    const chatId = query.message?.chat.id;
    if (!chatId)
        return;
    const dataCb = query.data || "";
    // Отвечаем на callback query
    bot.answerCallbackQuery(query.id);
    // Назад
    if (dataCb === "back") {
        bot.editMessageText("Выберите класс:", {
            chat_id: chatId,
            message_id: query.message?.message_id,
            reply_markup: classKeyboard(),
        });
        return;
    }
    // Выбор класса
    if (dataCb.startsWith("class:")) {
        const cls = dataCb.split(":")[1];
        if (Object.keys(data[cls]).length > 0) {
            bot.editMessageText(`Темы для ${cls} класса:`, {
                chat_id: chatId,
                message_id: query.message?.message_id,
                reply_markup: themeKeyboard(cls),
            });
        }
        else {
            bot.editMessageText(`Для ${cls} класса пока нет тем.`, {
                chat_id: chatId,
                message_id: query.message?.message_id,
                reply_markup: classKeyboard(),
            });
        }
        return;
    }
    // Выбор темы
    if (dataCb.startsWith("theme:")) {
        const [, cls, theme] = dataCb.split(":");
        const link = data[cls][theme];
        bot.editMessageText(`Тема: *${theme}*\n\nСсылка: ${link || "Нет ссылки"}`, {
            chat_id: chatId,
            message_id: query.message?.message_id,
            reply_markup: themeKeyboard(cls),
            parse_mode: "Markdown",
        });
        return;
    }
});
// ===== Админ-панель =====
// /admin
bot.onText(/\/admin/, (msg) => {
    if (msg.from?.id !== ADMIN_ID)
        return;
    bot.sendMessage(msg.chat.id, "Админ-панель:\n\n" +
        "/add_theme [класс] [тема]\n" +
        "/del_theme [класс] [тема]\n" +
        "/set_link [класс] [тема] [ссылка]\n" +
        "/del_link [класс] [тема]");
});
// Добавить тему
bot.onText(/\/add_theme (\d{1,2}) (.+)/, (msg, match) => {
    if (msg.from?.id !== ADMIN_ID)
        return;
    const cls = match?.[1];
    const theme = match?.[2];
    if (!cls || !theme)
        return;
    if (!data[cls])
        return bot.sendMessage(msg.chat.id, "Нет такого класса.");
    data[cls][theme] = "";
    saveData(data);
    bot.sendMessage(msg.chat.id, `Тема '${theme}' добавлена к классу ${cls}`);
});
// Удалить тему
bot.onText(/\/del_theme (\d{1,2}) (.+)/, (msg, match) => {
    if (msg.from?.id !== ADMIN_ID)
        return;
    const cls = match?.[1];
    const theme = match?.[2];
    if (!cls || !theme)
        return;
    if (data[cls] && data[cls][theme] !== undefined) {
        delete data[cls][theme];
        saveData(data);
        bot.sendMessage(msg.chat.id, `Тема '${theme}' удалена из класса ${cls}`);
    }
    else {
        bot.sendMessage(msg.chat.id, "Такой темы нет.");
    }
});
// Добавить/изменить ссылку
bot.onText(/\/set_link (\d{1,2}) (.+) (.+)/, (msg, match) => {
    if (msg.from?.id !== ADMIN_ID)
        return;
    const cls = match?.[1];
    const theme = match?.[2];
    const link = match?.[3];
    if (!cls || !theme || !link)
        return;
    if (data[cls] && data[cls][theme] !== undefined) {
        data[cls][theme] = link;
        saveData(data);
        bot.sendMessage(msg.chat.id, `Ссылка для '${theme}' обновлена: ${link}`);
    }
    else {
        bot.sendMessage(msg.chat.id, "Такой темы нет.");
    }
});
// Удалить ссылку
bot.onText(/\/del_link (\d{1,2}) (.+)/, (msg, match) => {
    if (msg.from?.id !== ADMIN_ID)
        return;
    const cls = match?.[1];
    const theme = match?.[2];
    if (!cls || !theme)
        return;
    if (data[cls] && data[cls][theme] !== undefined) {
        data[cls][theme] = "";
        saveData(data);
        bot.sendMessage(msg.chat.id, `Ссылка у темы '${theme}' удалена.`);
    }
    else {
        bot.sendMessage(msg.chat.id, "Такой темы нет.");
    }
});
// Запуск бота
console.log("Бот запущен...");
bot.on("polling_error", (error) => {
    console.error("Ошибка polling:", error);
});
