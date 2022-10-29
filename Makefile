.PHONY = build

build:
	npm run build

include .env

s3: build
	aws --endpoint-url=${AWS_ENDPOINT_URL} \
		--profile ${AWS_PROFILE} \
	    s3 cp \
	    --recursive dist/ \
	    s3://${AWS_BUCKET_NAME} \
		--exclude ".DS_Store"

run: dev
	npm run dev

dev:
	npm install

ngrok:
	ngrok http 5173

bot:
	python main.py