# Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y \
    ffmpeg libsm6 libxext6 && \
    pip install flask insightface opencv-python numpy requests

EXPOSE 5000

CMD ["python3", "app.py"]
