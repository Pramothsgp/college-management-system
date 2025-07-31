# Python Service – Face Recognition API

This service provides endpoints for training and recognizing student faces using images and videos. It is intended to be used as a backend microservice for the College Management System.

## Requirements
- Python 3.8+
- Flask
- OpenCV
- insightface
- numpy
- requests

## Endpoints

### 1. `POST /train`
- **Purpose:** Train or update a student's face embedding.
- **Request JSON:**
  ```json
  {
    "imageUrl": ["<image_url>"],   // or a single string
    "studentName": "<student_id or name>",
    "existingPklUrl": "<optional_existing_pkl_url>"
  }
  ```
- **Response JSON:**
  ```json
  {
    "student_name": "<student_id or name>",
    "embedding_base64": "<base64_string>"
  }
  ```
  or
  ```json
  { "error": "Invalid image" }
  ```

### 2. `POST /recognize`
- **Purpose:** Recognize students in videos using stored embeddings.
- **Request JSON:**
  ```json
  {
    "videoUrlList": ["<video_url1>", "<video_url2>", ...],
    "pklUrls": [
      { "id": "<student_id>", "url": "<pkl_url>" },
      ...
    ]
  }
  ```
- **Response JSON:**
  ```json
  [
    {
      "video_url": "<video_url>",
      "present": ["<student_id>", ...],
      "absent": ["<student_id>", ...],
      "total": ["<student_id>", ...]
    },
    ...
  ]
  ```

## Usage
- Run the service: `python app.py`
- The service listens on port 5001 by default.

## Notes
- All endpoints return JSON.
- The service is intended to be called by the Node.js backend.
- Embeddings are serialized using pickle and base64 encoding.
