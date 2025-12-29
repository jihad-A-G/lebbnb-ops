import mongoose, { Schema, Document } from 'mongoose';

export interface IAbout extends Document {
  title: string;
  subtitle?: string;
  description: string;
  mission?: string;
  vision?: string;
  values?: string[];
  teamMembers?: Array<{
    name: string;
    position: string;
    bio?: string;
    image?: string;
  }>;
  companyStats?: Array<{
    label: string;
    value: string;
  }>;
  images?: string[];
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    mission: {
      type: String,
      trim: true,
      maxlength: [1000, 'Mission cannot exceed 1000 characters']
    },
    vision: {
      type: String,
      trim: true,
      maxlength: [1000, 'Vision cannot exceed 1000 characters']
    },
    values: {
      type: [String],
      default: []
    },
    teamMembers: [{
      name: { type: String, required: true, trim: true },
      position: { type: String, required: true, trim: true },
      bio: { type: String, trim: true },
      image: { type: String, trim: true }
    }],
    companyStats: [{
      label: { type: String, required: true, trim: true },
      value: { type: String, required: true, trim: true }
    }],
    images: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAbout>('About', AboutSchema);
