# -*- coding: utf-8 -*-
import os
import sys
import random
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from pyngrok import ngrok
from dotenv import load_dotenv

# Fix encoding cho Windows terminal
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(__name__)
CORS(app, origins=[
    "https://hoatuoithanhngoc.com",
    "https://www.hoatuoithanhngoc.com",
    "https://hoatuoithanhngoc-q8afwdl8u-phong784s-projects.vercel.app",
    "https://hoatuoithanhngoc.vercel.app",
    "https://hoatuoithanhngoc-production.up.railway.app",
    "http://localhost:5173",
    "http://localhost:5000",
    "http://127.0.0.1:5500",
])
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

OA_ACCESS_TOKEN = os.environ.get("ZALO_OA_TOKEN")
ZALO_API = "https://openapi.zalo.me/v3.0/oa/message/cs"

conversation_history = {}
greeted_users = set()

BASE_IMG_URL = "https://hoatuoithanhngoc-main.vercel.app/images/products"

PRODUCT_IMAGES = {
    "bo-hoa": {
        "folder": "anh-hoa-bo",
        "prefix": "hoa-bo-dep-hoa-tuoi-thanh-ngoc-hue",
        "count": 25
    },
    "khai-truong": {
        "folder": "anh-khai-truong",
        "prefix": "hop-hoa-khai-truong-cong-ty-hoa-tuoi-thanh-ngoc-hue",
        "count": 49
    },
    "chia-buon": {
        "folder": "hoa-chia-buon",
        "prefix": "hoa-tang-chia-buon-tam-tu-hoa-tuoi-thanh-ngoc-hue",
        "count": 46
    },
    "lan-ho-diep": {
        "folder": "hoa-lan-ho-diep",
        "prefix": "hoa-lan-ho-diep-chinh-gia-hoa-tuoi-thanh-ngoc-hue",
        "count": 51
    }
}

KEYWORDS = {
    "bo-hoa": ["bó hoa", "bo hoa", "hoa hồng", "hoa hong", "hoa tulip", "hoa cúc",
               "sinh nhật", "sinh nhat", "tình yêu", "tinh yeu", "hoa tươi", "hoa tuoi",
               "bó", "tặng hoa", "tang hoa", "hoa tặng"],
    "khai-truong": ["khai trương", "khai truong", "kệ hoa", "ke hoa", "lẵng hoa",
                    "khai nghiệp", "mừng khai"],
    "chia-buon": ["chia buồn", "chia buon", "tang lễ", "tang le", "đám tang",
                  "viếng", "mất người", "qua đời"],
    "lan-ho-diep": ["lan hồ điệp", "lan ho diep", "hoa lan", "hồ điệp", "chậu lan"],
}

SYSTEM_PROMPT = """Bạn tên là Ngọc, nhân viên tư vấn tại Tiệm Hoa Tươi Thanh Ngọc ở Bình Thạnh, TP.HCM.

Cách nói chuyện:
- Xưng "em", gọi khách "anh/chị", nói chuyện tự nhiên như người thật, KHÔNG dùng danh sách bullet hay đánh số cứng nhắc
- Hỏi thêm để hiểu nhu cầu khách trước khi tư vấn, ví dụ: tặng ai, dịp gì, ngân sách khoảng bao nhiêu
- Dùng ngôn ngữ gần gũi, đôi khi thêm cảm xúc tự nhiên ("ôi dịp đó đẹp lắm ạ", "anh/chị yên tâm em lo được")
- Emoji dùng tự nhiên, đừng lạm dụng
- Câu trả lời ngắn gọn, đúng trọng tâm, tối đa 200 từ

Thông tin tiệm:
- Địa chỉ: 8 Phan Văn Hân, P.19, Bình Thạnh, TP.HCM — 20 năm uy tín
- Điện thoại: 093 492 6092
- Giờ mở cửa: 07:00 – 21:00 mỗi ngày
- Website: hoatuoithanhngoc-main.vercel.app

Sản phẩm: Bó hoa, Hoa khai trương, Giỏ hoa, Hoa chia buồn, Lan hồ điệp — hơn 70 mẫu, hoa tươi nhập mỗi ngày.
Về giá: tuỳ mẫu, mời khách gọi 093 492 6092 hoặc nhắn cụ thể để báo giá.
Khi khách hỏi xem ảnh: nói "Em gửi ảnh cho anh/chị xem ngay!" — hệ thống tự gửi ảnh kèm."""


def detect_category(text):
    text = text.lower()
    for category, keywords in KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return category
    return None


def get_random_images(category, n=3):
    if category not in PRODUCT_IMAGES:
        return []
    info = PRODUCT_IMAGES[category]
    indices = random.sample(range(1, info["count"] + 1), min(n, info["count"]))
    return [
        f"{BASE_IMG_URL}/{info['folder']}/{info['prefix']}-{i:03d}.webp"
        for i in indices
    ]


def send_text(user_id, text):
    headers = {"access_token": OA_ACCESS_TOKEN, "Content-Type": "application/json"}
    payload = {
        "recipient": {"user_id": user_id},
        "message": {"text": text}
    }
    resp = requests.post(ZALO_API, json=payload, headers=headers)
    print(f"[SEND] user={user_id} status={resp.status_code} resp={resp.text}")


def send_images(user_id, category):
    urls = get_random_images(category, n=3)
    headers = {"access_token": OA_ACCESS_TOKEN, "Content-Type": "application/json"}
    for url in urls:
        payload = {
            "recipient": {"user_id": user_id},
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "list",
                        "elements": [{
                            "title": "Hoa Tươi Thanh Ngọc",
                            "subtitle": "Liên hệ: 093 492 6092",
                            "image_url": url,
                            "default_action": {
                                "type": "oa.open.url",
                                "url": "https://hoatuoithanhngoc-main.vercel.app"
                            }
                        }]
                    }
                }
            }
        }
        requests.post(ZALO_API, json=payload, headers=headers)


def get_ai_reply(user_id, text):
    """Gọi Groq AI, trả về (reply, category). Không gửi Zalo."""
    if user_id not in conversation_history:
        conversation_history[user_id] = []

    first_time = user_id not in greeted_users
    if first_time:
        greeted_users.add(user_id)
        conversation_history[user_id].insert(0, {
            "role": "system",
            "content": "Đây là lần đầu tiên khách nhắn tin. Hãy chào khách thật tự nhiên, ấm áp rồi hỏi khách cần gì, sau đó mới trả lời nội dung tin nhắn."
        })

    conversation_history[user_id].append({"role": "user", "content": text})

    if len(conversation_history[user_id]) > 22:
        conversation_history[user_id] = conversation_history[user_id][-20:]

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in conversation_history[user_id]:
        if msg["role"] == "system":
            messages[0]["content"] += "\n\n" + msg["content"]
        else:
            messages.append(msg)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=512,
        temperature=0.85
    )

    reply = response.choices[0].message.content.strip()
    conversation_history[user_id].append({"role": "assistant", "content": reply})

    category = detect_category(text + " " + reply)
    return reply, category


def process_message(user_id, text):
    """Dùng cho Zalo webhook — lấy reply và gửi về Zalo."""
    try:
        reply, category = get_ai_reply(user_id, text)
        send_text(user_id, reply)
        if category:
            send_images(user_id, category)
    except Exception as e:
        send_text(user_id, "Xin lỗi anh/chị, em gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc gọi 093 492 6092 ạ!")
        print(f"Lỗi: {e}")


@app.route("/chat", methods=["POST"])
def chat():
    """Endpoint cho widget chat trên website."""
    data = request.json or {}
    session_id = data.get("session_id", "web_anon")
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "empty message"}), 400
    try:
        reply, category = get_ai_reply("web_" + session_id, message)
        images = get_random_images(category, n=3) if category else []
        return jsonify({"reply": reply, "images": images})
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"reply": "Xin lỗi anh/chị, em gặp sự cố. Vui lòng thử lại sau hoặc gọi 093 492 6092 ạ!"}), 200


@app.route("/zalo_verifier<path:filename>")
def zalo_verify_file(filename):
    desktop = os.path.dirname(__file__)
    return app.send_static_file(f"zalo_verifier{filename}")

app.static_folder = os.path.dirname(__file__)


@app.route("/webhook", methods=["GET"])
def verify():
    return request.args.get("challenge", "OK")


@app.route("/webhook", methods=["POST"])
def webhook():
    try:
        data = request.json or {}
        event = data.get("event_name", "")
        print(f"[WEBHOOK] event={event} data={data}")
        if event == "user_send_text":
            user_id = data["sender"]["id"]
            text = data["message"]["text"]
            print(f"[MSG] user={user_id} text={text}")
            import threading
            threading.Thread(target=process_message, args=(user_id, text), daemon=True).start()
    except Exception as e:
        print(f"Webhook error: {e}")
    return jsonify({"error": 0}), 200


if __name__ == "__main__":
    print("=" * 60)
    print("🌸 Hoa Tươi Thanh Ngọc — Chat Bot Server")
    print("=" * 60)

    if not os.environ.get("GROQ_API_KEY"):
        print("❌  Chưa có GROQ_API_KEY trong file .env!")
        exit(1)

    if not os.environ.get("ZALO_OA_TOKEN"):
        print("⚠️  Chưa có ZALO_OA_TOKEN — Zalo webhook sẽ không hoạt động")
        print("   (Chat AI trên website vẫn chạy bình thường)")

    # Tuỳ chọn: mở ngrok tunnel cho Zalo webhook
    ngrok_token = os.environ.get("NGROK_TOKEN")
    if ngrok_token:
        try:
            ngrok.set_auth_token(ngrok_token)
            tunnel = ngrok.connect(5000)
            webhook_url = tunnel.public_url + "/webhook"
            print(f"✅ Zalo Webhook URL: {webhook_url}")
            print("👆 Copy URL trên vào Zalo Developers → Webhook")
        except Exception as e:
            print(f"⚠️  Không mở được ngrok: {e}")

    print(f"✅ Chat API: http://localhost:5000/chat")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)
