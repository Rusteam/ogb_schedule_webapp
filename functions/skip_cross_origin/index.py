import json
import os

import requests

WEBHOOK_URL = os.getenv("WEBHOOK_URL")


def handler(event, context):
    if event['httpMethod'] == 'OPTIONS':
        print("OPTIONS:", event)
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
        }
        return dict(statusCode=204, headers=headers)

    body = event["body"]
    # body = base64.b64decode(body).decode()
    body = json.loads(body)
    print("BODY:", body)
    resp = requests.post(WEBHOOK_URL, data=body)
    print("RESPONSE:", resp.content.decode())
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    return {
        "statusCode": resp.status_code,
        "body": resp.content.decode(),
        "headers": headers
    }
