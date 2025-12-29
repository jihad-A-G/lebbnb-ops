import { Request, Response } from 'express';
import Home from '../models/Home.model';
import '../models/Property.model'; // Import to register the Gallery model
import { deleteFiles } from '../config/multer';

// Get home page content (Public)
export const getHome = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get the first (and should be only) home document
    let home = await Home.findOne()
      .populate('featuredProperties')
      .lean();

    // If no home document exists, create a default one
    if (!home) {
      const newHome = await Home.create({
        heroTitle: 'Welcome to Our Rental Company',
        heroSubtitle: 'Find Your Perfect Property',
        sections: [],
        testimonials: [],
        stats: []
      });
      home = newHome.toObject() as any;
    }

    res.status(200).json({
      status: 'success',
      data: { home }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch home content',
      error: error.message
    });
  }
};

// Update home page content (Admin)
export const updateHome = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find existing document or create new one
    let home = await Home.findOne();

    if (!home) {
      home = await Home.create(req.body);
    } else {
      Object.assign(home, req.body);
      await home.save();
    }

    // Populate featured properties
    await home.populate('featuredProperties');

    res.status(200).json({
      status: 'success',
      message: 'Home content updated successfully',
      data: { home }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update home content',
      error: error.message
    });
  }
};

// Upload hero image (Admin)
export const uploadHeroImage = async (req: Request, res: Response): Promise<void> => {
  try {
    let home = await Home.findOne();

    if (!home) {
      home = await Home.create({
        heroTitle: 'Welcome to Our Rental Company',
        heroSubtitle: 'Find Your Perfect Property'
      });
    }

    if (!req.file) {
      res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
      return;
    }

    // Delete old hero image if exists
    if (home.heroImage) {
      deleteFiles([home.heroImage]);
    }

    // Update with new image
    home.heroImage = req.file.filename;
    await home.save();

    res.status(200).json({
      status: 'success',
      message: 'Hero image uploaded successfully',
      data: { heroImage: home.heroImage }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload hero image',
      error: error.message
    });
  }
};

// Upload section images (Admin)
export const uploadSectionImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sectionIndex } = req.params;
    let home = await Home.findOne();

    if (!home) {
      res.status(404).json({
        status: 'error',
        message: 'Home content not found'
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
      return;
    }

    const index = parseInt(sectionIndex);
    if (!home.sections || !home.sections[index]) {
      res.status(404).json({
        status: 'error',
        message: 'Section not found'
      });
      return;
    }

    // Delete old image if exists
    if (home.sections[index].image) {
      deleteFiles([home.sections[index].image!]);
    }

    // Update with new image
    home.sections[index].image = req.file.filename;
    await home.save();

    res.status(200).json({
      status: 'success',
      message: 'Section image uploaded successfully',
      data: { image: home.sections[index].image }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload section image',
      error: error.message
    });
  }
};

// Upload testimonial images (Admin)
export const uploadTestimonialImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testimonialIndex } = req.params;
    let home = await Home.findOne();

    if (!home) {
      res.status(404).json({
        status: 'error',
        message: 'Home content not found'
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
      return;
    }

    const index = parseInt(testimonialIndex);
    if (!home.testimonials || !home.testimonials[index]) {
      res.status(404).json({
        status: 'error',
        message: 'Testimonial not found'
      });
      return;
    }

    // Delete old image if exists
    if (home.testimonials[index].image) {
      deleteFiles([home.testimonials[index].image!]);
    }

    // Update with new image
    home.testimonials[index].image = req.file.filename;
    await home.save();

    res.status(200).json({
      status: 'success',
      message: 'Testimonial image uploaded successfully',
      data: { image: home.testimonials[index].image }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload testimonial image',
      error: error.message
    });
  }
};
