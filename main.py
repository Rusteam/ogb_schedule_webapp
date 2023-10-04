import os

from telebot import types
import telebot
import dotenv


dotenv.load_dotenv(".env")
bot = telebot.TeleBot(os.environ.get("TELEGRAM_BOT_TOKEN", input("enter telegram token: ")))
prod_link = os.environ.get("OGB_PROD_LINK", input("enter prod link: "))
dev_link = os.environ.get("OGB_DEV_LINK", input("enter dev link: "))


def inline_keyboard():
    keyboard = types.InlineKeyboardMarkup()
    webAppTest = types.WebAppInfo(prod_link)
    webAppGame = types.WebAppInfo(
        dev_link
    )
    one_butt = types.InlineKeyboardButton(
        text="Production", web_app=webAppTest
    )
    two_butt = types.InlineKeyboardButton(
        text="Development", web_app=webAppGame
    )
    keyboard.add(
        one_butt,
        two_butt,
    )

    return keyboard


def keyboard():
    keyboard = types.ReplyKeyboardMarkup(row_width=1)
    webAppTest = types.WebAppInfo(prod_link)
    webAppGame = types.WebAppInfo(dev_link)
    one_butt = types.KeyboardButton(
        text="Production", web_app=webAppTest
    )
    two_butt = types.KeyboardButton(
        text="Development", web_app=webAppGame
    )
    keyboard.add(
        one_butt,
        two_butt,
    )

    return keyboard


@bot.message_handler(commands=["start"])
def start_fun(message):
    bot.send_message(
        message.chat.id,
        "Open a web app by clicking an inline button",
        parse_mode="Markdown",
        reply_markup=inline_keyboard(),
    )


@bot.message_handler(content_types="text")
def new_mes(message):
    bot.send_message(message.chat.id,
                     "Open a web app by clicking a keyboard button",
                     reply_markup=keyboard())


@bot.message_handler(
    content_types="web_app_data"
)
def answer(webAppMes):
    bot.send_message(
        webAppMes.chat.id,
        f"получили инофрмацию из веб-приложения: {webAppMes.web_app_data.data}",
    )


if __name__ == "__main__":
    bot.infinity_polling()
