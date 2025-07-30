
import { Schema, model, Types } from 'mongoose';

const fileSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const Images = model('Images', fileSchema);
