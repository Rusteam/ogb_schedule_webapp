import os
import requests
import base64
import ast


WEBHOOK_URL = os.getenv("WEBHOOK_URL")


def handler(event, context):
    body = base64.b64decode(event["body"]).decode()
    print("BODY:", body)
    resp = requests.post(WEBHOOK_URL, data=ast.literal_eval(body))
    print("RESPONSE:", resp.content.decode())
    return {
        "statusCode": resp.status_code,
        "body": resp.content.decode()
    }
