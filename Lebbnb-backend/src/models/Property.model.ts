import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  address: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, 'Gallery title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
   
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
   
    images: {
      type: [String],
      default: []
    },
  },
  {
    timestamps: true
  }
);

// Index for sorting by creation date
GallerySchema.index({ createdAt: -1 });

export default mongoose.model<IGallery>('Gallery', GallerySchema);
