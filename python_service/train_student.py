import sys
import os
import requests
import cv2
import numpy as np
import pickle
import base64
import json
from insightface.app import FaceAnalysis

def download_image(url):
    resp = requests.get(url, stream=True)
    if resp.status_code == 200:
        arr = np.asarray(bytearray(resp.content), dtype=np.uint8)
        return cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return None

def update_embedding(image_url, student_name, existing_pkl_url=None):
    app = FaceAnalysis(name='buffalo_s', providers=['CPUExecutionProvider'])
    app.prepare(ctx_id=0)

    img = download_image(image_url)
    if img is None:
        return {"error": "Invalid image"}

    faces = app.get(img)
    if not faces:
        return {"error": "No face found"}

    new_embedding = faces[0].embedding

    # Load old embedding if exists
    if existing_pkl_url:
        existing = requests.get(existing_pkl_url).content
        old_embedding = pickle.loads(existing)
        updated = np.mean([old_embedding, new_embedding], axis=0)
    else:
        updated = new_embedding

    # Serialize to bytes
    serialized = pickle.dumps(updated)
    encoded = base64.b64encode(serialized).decode('utf-8')

    return {
        "student_name": student_name,
        "embedding_base64": encoded
    }

if __name__ == "__main__":
    image_url = sys.argv[1]
    student_name = sys.argv[2]
    existing_pkl_url = sys.argv[3] if len(sys.argv) > 3 else None

    result = update_embedding(image_url, student_name, existing_pkl_url)
    print(json.dumps(result))
