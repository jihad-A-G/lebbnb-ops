import mongoose, { Schema, Document } from 'mongoose';

export interface IHome extends Document {
  heroTitle: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  featuredProperties?: mongoose.Types.ObjectId[];
  sections?: Array<{
    title: string;
    content: string;
    image?: string;
    order: number;
  }>;
  testimonials?: Array<{
    name: string;
    text: string;
    rating?: number;
    image?: string;
  }>;
  stats?: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  updatedAt: Date;
}

const HomeSchema = new Schema<IHome>(
  {
    heroTitle: {
      type: String,
      required: [true, 'Hero title is required'],
      trim: true,
      maxlength: [200, 'Hero title cannot exceed 200 characters']
    },
    heroSubtitle: {
      type: String,
      trim: true,
      maxlength: [300, 'Hero subtitle cannot exceed 300 characters']
    },
    heroDescription: {
      type: String,
      trim: true,
      maxlength: [1000, 'Hero description cannot exceed 1000 characters']
    },
    heroImage: {
      type: String,
      trim: true
    },
    heroCtaText: {
      type: String,
      trim: true,
      maxlength: [50, 'CTA text cannot exceed 50 characters']
    },
    heroCtaLink: {
      type: String,
      trim: true
    },
    featuredProperties: [{
      type: Schema.Types.ObjectId,
      ref: 'Gallery'
    }],
    sections: [{
      title: { type: String, required: true, trim: true },
      content: { type: String, required: true, trim: true },
      image: { type: String, trim: true },
      order: { type: Number, required: true }
    }],
    testimonials: [{
      name: { type: String, required: true, trim: true },
      text: { type: String, required: true, trim: true },
      rating: { type: Number, min: 1, max: 5 },
      image: { type: String, trim: true }
    }],
    stats: [{
      label: { type: String, required: true, trim: true },
      value: { type: String, required: true, trim: true },
      icon: { type: String, trim: true }
    }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IHome>('Home', HomeSchema);
