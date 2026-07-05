import requests
import os
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN")
INSTAGRAM_ACCOUNT_ID = os.getenv("INSTAGRAM_ACCOUNT_ID")


def publish_instagram_post(image_url, caption):

    create_media_url = (
        f"https://graph.facebook.com/v23.0/"
        f"{INSTAGRAM_ACCOUNT_ID}/media"
    )

    media_payload = {
        "image_url": image_url,
        "caption": caption,
        "access_token": ACCESS_TOKEN
    }

    media_response = requests.post(
        create_media_url,
        data=media_payload
    )

    media_data = media_response.json()

    if "id" not in media_data:
        return media_data

    creation_id = media_data["id"]

    publish_url = (
        f"https://graph.facebook.com/v23.0/"
        f"{INSTAGRAM_ACCOUNT_ID}/media_publish"
    )

    publish_payload = {
        "creation_id": creation_id,
        "access_token": ACCESS_TOKEN
    }

    publish_response = requests.post(
        publish_url,
        data=publish_payload
    )

    return publish_response.json()