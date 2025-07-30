import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "./UploadForm.css";

const UploadForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append("name", name);
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      await axios.post("/your-endpoint", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload successful!");
      setName("");
      setPhotos([]);
    } catch (err) {
      alert("Upload failed!");
    }
    setUploading(false);
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label className="form-label">
        Name
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          placeholder="Enter name"
        />
      </label>
      <label className="form-label">
        Photos
        <input
          type="file"
          accept="image/*"
          multiple
          required
          onChange={handlePhotoChange}
          className="form-input"
        />
      </label>
      {/* List selected images vertically */}
      <ul className="photo-list">
        {photos.map((photo, idx) => (
          <li key={idx} className="photo-list-item">
            <img
              src={URL.createObjectURL(photo)}
              alt={`preview-${idx}`}
              className="photo-img"
            />
            <span className="photo-name">{photo.name}</span>
          </li>
        ))}
      </ul>
      <button type="submit" className="upload-btn" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadForm;