# Node.js Server – College Management System API

This server provides authentication, file upload, and attendance management endpoints for the College Management System. It integrates with a Python microservice for face recognition.

## Requirements
- Node.js 18+
- MongoDB
- AWS S3 (for file storage)

## Main Endpoints

### Auth (`/api/auth`)
- **POST `/register`**
  - Request: `{ "email": "...", "password": "...", "role": "student|admin" }`
  - Response: `{ "user": { ... } }`
- **POST `/login`**
  - Request: `{ "email": "...", "password": "..." }`
  - Response: `{ "token": "..." }`
- **DELETE `/:userId`**
  - Response: `{ "message": "User deleted successfully" }`
- **POST `/register-in-bulk`**
  - **Authorization:** Bearer <token>
  - Request: `{
    "users" : ["727723euit162@skcet.ac.in" , "727723euit153@skcet.ac.in"],
    "password" : "123123",
    "role" : "student"
}`
  - Response: `{ "message": "Users registered successfully" }`
### File Upload (`/api/file-upload/upload/:userId`)
- **POST** (multipart/form-data, files in `files[]`)
  - Response:
    ```json
    {
      "message": "Files uploaded successfully",
      "fileUrls": ["<url1>", ...]
    }
    ```
  - Triggers training and stores PKL file for the user.

### Attendance (`/api/attendance`)
## jwt token
- **Authorization:** Bearer <token>
- **POST `/`** (Mark attendance manually)
  - Request: `{ "studentId": "...", "date": "...", "sessions": { ... } }`
  - Response: Attendance record object

- **GET `/:studentId`** (Get attendance for a student)
  - Response: `[ ...attendance records... ]`

- **POST `/mark-attendance`** (Mark attendance from video)
  - Request: `multipart/form-data` with `videos[]`, `session`, `date`
  - Response: Result of attendance marking (depends on background processing)

## Notes
- All endpoints return JSON.
- File uploads use multipart/form-data.
- Attendance from video triggers background processing and may not be instant.
- The server calls the Python service for face recognition and training.
