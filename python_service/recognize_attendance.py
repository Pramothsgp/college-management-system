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
    if not url or not url.startswith(("http://", "https://")):
        raise ValueError(f"Invalid URL provided to download_file: {url}")
    response = requests.get(url, stream=True)
    response.raise_for_status()
    return response.content

def recognize_faces(video_urls, pkl_objs):
    if not video_urls:
        raise ValueError("No video URLs provided!")
    if not pkl_objs:
        raise ValueError("No PKL objects provided!")

    # Initialize face analysis model once
    app = FaceAnalysis(name='buffalo_s', providers=['CPUExecutionProvider'])
    app.prepare(ctx_id=0)

    # Load all student embeddings from PKL objects
    embeddings = {}
    for obj in pkl_objs:
        try:
            student_id = obj["id"]
            url = obj["url"]
            content = download_file(url)
            embeddings[student_id] = pickle.loads(content)
        except Exception as e:
            print(f"Failed to load embedding for ID {student_id}: {e}")

    if not embeddings:
        raise RuntimeError("No valid embeddings loaded from the PKL objects.")

    # Prepare results container
    total_ids = list(embeddings.keys())
    final_results = []

    for idx, video_url in enumerate(video_urls):
        try:
            video_path = f"temp_video_{idx}.mp4"
            with open(video_path, "wb") as f:
                f.write(download_file(video_url))

            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                print(f"Could not open video file: {video_path}")
                continue

            present = set()
            threshold = 0.5  # similarity threshold

            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                faces = app.get(frame)
                for face in faces:
                    for student_id, known_emb in embeddings.items():
                        sim = cosine_similarity(face.embedding, known_emb)
                        if sim >= threshold:
                            present.add(student_id)
                            break
            cap.release()

            absent = list(set(total_ids) - present)

            final_results.append({
                "video_url": video_url,
                "present": list(present),
                "absent": absent,
                "total": total_ids
            })

            os.remove(video_path)

        except Exception as e:
            print(f"Error processing video {video_url}: {e}")

    return final_results


# CLI usage
if __name__ == "__main__":
    import json

    if len(sys.argv) < 3:
        print("Usage: python recognize_attendance.py <video_urls_comma_separated> <pkl_url1> [pkl_url2 ...]")
        sys.exit(1)

    video_urls = sys.argv[1].split(",")
    pkl_urls = sys.argv[2:]

    try:
        result = recognize_faces(video_urls, pkl_urls)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}")
