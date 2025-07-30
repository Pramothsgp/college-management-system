import sys
import os
import requests
import pickle
import cv2
import numpy as np
from insightface.app import FaceAnalysis
from numpy.linalg import norm

def cosine_similarity(a, b):
    return np.dot(a, b) / (norm(a) * norm(b))

def download_file(url):
    return requests.get(url, stream=True).content

def recognize_faces(video_urls, pkl_urls):
    app = FaceAnalysis(name='buffalo_s', providers=['CPUExecutionProvider'])
    app.prepare(ctx_id=0)

    # Load all student embeddings
    embeddings = {}
    for url in pkl_urls:
        name = os.path.basename(url).replace(".pkl", "")
        embeddings[name] = pickle.loads(download_file(url))

    # Prepare result container
    total_names = list(embeddings.keys())
    final_results = []

    # Process each video
    for idx, video_url in enumerate(video_urls):
        video_path = f"temp_video_{idx}.mp4"
        with open(video_path, "wb") as f:
            f.write(download_file(video_url))

        cap = cv2.VideoCapture(video_path)
        present = set()
        threshold = 0.5

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            faces = app.get(frame)
            for face in faces:
                for name, known_emb in embeddings.items():
                    sim = cosine_similarity(face.embedding, known_emb)
                    if sim >= threshold:
                        present.add(name)
                        break
        cap.release()

        absent = list(set(total_names) - present)

        final_results.append({
            "video_url": video_url,
            "present": list(present),
            "absent": absent,
            "total": total_names
        })

    return final_results

# CLI usage
if __name__ == "__main__":
    import json
    video_urls = sys.argv[1].split(",")  # comma-separated
    pkl_urls = sys.argv[2:]
    result = recognize_faces(video_urls, pkl_urls)
    print(json.dumps(result))
