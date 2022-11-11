# OfficeGymBot Scheduler WebApp
Set a schedule from a Telegram WebApp for @OfficeGymBot.

## Usage

**Pre-reqs:**
- npm
- ngrok
- python
- aws cli

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