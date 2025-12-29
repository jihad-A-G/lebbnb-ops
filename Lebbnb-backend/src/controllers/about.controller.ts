import { Request, Response } from 'express';
import About from '../models/About.model';
import { deleteFiles } from '../config/multer';

// Get about us content (Public)
export const getAbout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get the first (and should be only) about document
    let about = await About.findOne().lean();

    // If no about document exists, create a default one
    if (!about) {
      const newAbout = await About.create({
        title: 'About Our Company',
        description: 'Welcome to our rental company.',
        values: []
      });
      about = newAbout.toObject() as any;
    }

    res.status(200).json({
      status: 'success',
      data: { about }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch about content',
      error: error.message
    });
  }
};

// Update about us content (Admin)
export const updateAbout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find existing document or create new one
    let about = await About.findOne();

    if (!about) {
      about = await About.create(req.body);
    } else {
      Object.assign(about, req.body);
      await about.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'About content updated successfully',
      data: { about }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update about content',
      error: error.message
    });
  }
};

// Upload about images (Admin)
export const uploadAboutImages = async (req: Request, res: Response): Promise<void> => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({
        title: 'About Our Company',
        description: 'Welcome to our rental company.',
        images: []
      });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'No files uploaded'
      });
      return;
    }

    // Get filenames
    const filenames = req.files.map((file: Express.Multer.File) => file.filename);
    
    // Add to about images
    if (!about.images) {
      about.images = [];
    }
    about.images.push(...filenames);
    await about.save();

    res.status(200).json({
      status: 'success',
      message: 'Images uploaded successfully',
      data: {
        uploadedImages: filenames,
        totalImages: about.images.length
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload images',
      error: error.message
    });
  }
};

// Delete about image (Admin)
export const deleteAboutImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    const about = await About.findOne();

    if (!about || !about.images) {
      res.status(404).json({
        status: 'error',
        message: 'About content not found'
      });
      return;
    }

    // Remove image from array
    const imageIndex = about.images.indexOf(filename);
    if (imageIndex === -1) {
      res.status(404).json({
        status: 'error',
        message: 'Image not found'
      });
      return;
    }

    about.images.splice(imageIndex, 1);
    await about.save();

    // Delete file from disk
    deleteFiles([filename]);

    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image',
      error: error.message
    });
  }
};
