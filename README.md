# 📆 Telegram Scheduler WebApp 

Set a fitness schedule from a Telegram WebApp for [@OfficeGymBot](https://t.me/officegymbot).

--- 

![][mit-badge] * [![][tg-ogb-badge]][tg-ogb-link] * [![][web-ogb-badge]][web-ogb-link] * ![][used-badge]

[mit-badge]: https://img.shields.io/badge/license-MIT-lightgreen
[tg-ogb-badge]: https://img.shields.io/badge/try-telegram-blue?logo=telegram&logoColor=white
[tg-ogb-link]: https://t.me/officegymbot
[web-ogb-badge]: https://img.shields.io/badge/try-web-yellow?logoColor=white
[web-ogb-link]: https://office-gym-bot.website.yandexcloud.net
[used-badge]: https://img.shields.io/badge/activated-%3E%203k%20times-green?logo=telegram&logoColor=white

---

## 📱 Features 
- set training days of week and time 💪
- auto timezone detection 🗺️
- dark and light modes 🚥

## Usage

### Prerequisites
- [build] npm
- [test] ngrok
- [test] python3.9
- [deployment] aws cli

### Install and run
```shell
make dev
make run
```
Review the app on [localhost](http://localhost:5173)

### Open from Telegram bot

1. Run a test bot: `make bot`
2. Run a ngrok to expose the app on https: `make ngrok`

### Build dist

Build a static website for distribution:
```shell
make build
```

### Deploy to S3

1. Create `.env` file with `AWS_*` credentials as in `.env.example`.
2. Upload dist files to S3: `make s3`


## Project structure

This project consists of three components:
1. Main javascript WebApp to set a traininf schedule and 
send a post request to a webhook.
2. Python telegram bot app for testing the WebApp locally.
3. Python cloud function to relay requests from the WebApp to a BotMother webhook 
(it is used to bypass browser CORS restrictions). Two identical functions with different 
environment variables are used. 