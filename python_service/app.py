# app.py
from flask import Flask, request, jsonify
from train_student import update_embedding
from recognize_attendance import recognize_faces

app = Flask(__name__)

@app.route("/train", methods=["POST"])
def train():
    data = request.get_json()
    image_url_list = data.get("imageUrl", [])
    image_url = image_url_list[0] if isinstance(image_url_list, list) else image_url_list

    student_name = data.get("studentName")
    existing_pkl_url = data.get("existingPklUrl")

    result = update_embedding(image_url, student_name, existing_pkl_url)
    return jsonify(result)

@app.route("/recognize", methods=["POST"])
def recognize():
    data = request.get_json()
    video_url_list = data.get("videoUrlList", [])
    video_url = video_url_list[0] if isinstance(video_url_list, list) else video_url_list
    pkl_urls = data.get("pklUrls")

    result = recognize_faces(video_url, pkl_urls)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
