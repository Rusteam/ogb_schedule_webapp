import os

from telebot import types
import telebot

bot = telebot.TeleBot(os.getenv("TELEGRAM_BOT_TOKEN", input("enter telegram token: ")))
codepen_link = os.getenv("OGB_CODEPEN_LINK", input("enter codepen link: "))
ngrok_link = os.getenv("OGB_NGROK_LINK", input("enter ngrok link: "))


def inline_keyboard():  # создание клавиатуры с webapp кнопкой
    keyboard = types.InlineKeyboardMarkup()  # создаем клавиатуру
    webAppTest = types.WebAppInfo(codepen_link)
    webAppGame = types.WebAppInfo(
        ngrok_link
    )  # создаем webappinfo - формат хранения url
    one_butt = types.InlineKeyboardButton(
        text="Codepen", web_app=webAppTest
    )  # создаем кнопку типа webapp
    two_butt = types.InlineKeyboardButton(
        text="Localhost", web_app=webAppGame
    )  # создаем кнопку типа 10webapp
    keyboard.add(
        one_butt,
        two_butt,
    )  # добавляем кнопки в клавиатуру

    return keyboard  # возвращаем клавиатуру


def keyboard():  # создание клавиатуры с webapp кнопкой
    keyboard = types.ReplyKeyboardMarkup(row_width=1)  # создаем клавиатуру
    webAppTest = types.WebAppInfo(codepen_link)
    webAppGame = types.WebAppInfo(
        ngrok_link
    )  # создаем webappinfo - формат хранения url
    one_butt = types.KeyboardButton(
        text="Codepen", web_app=webAppTest
    )  # создаем кнопку типа webapp
    two_butt = types.KeyboardButton(
        text="Localhost", web_app=webAppGame
    )  # создаем кнопку типа 10webapp
    keyboard.add(
        one_butt,
        two_butt,
    )  # добавляем кнопки в клавиатуру

    return keyboard  # возвращаем клавиатуру


@bot.message_handler(commands=["start"])  # обрабатываем команду старт
def start_fun(message):
    bot.send_message(
        message.chat.id,
        "Open a web app by clicking an inline button",
        parse_mode="Markdown",
        reply_markup=inline_keyboard(),
    )  # отправляем сообщение с нужной клавиатурой


@bot.message_handler(content_types="text")
def new_mes(message):
    bot.send_message(message.chat.id,
                     "Open a web app by clicking a keyboard button",
                     reply_markup=keyboard())


@bot.message_handler(
    content_types="web_app_data"
)  # получаем отправленные данные
def answer(webAppMes):
    print(webAppMes.web_app_data.data)  # конкретно то что мы передали в бота
    bot.send_message(
        webAppMes.chat.id,
        f"получили инофрмацию из веб-приложения: {webAppMes.web_app_data.data}",
    )
    # отправляем сообщение в ответ на отправку данных из веб-приложения


if __name__ == "__main__":
    bot.infinity_polling()
