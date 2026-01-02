import { Request, Response } from 'express';
import Gallery from '../models/Property.model';
import { deleteFiles } from '../config/multer';
import { optimizeImages } from '../utils/imageOptimizer';
import path from 'path';

// Get all gallery items (Public)
export const getAllProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query;

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [galleryItems, total] = await Promise.all([
      Gallery.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Gallery.countDocuments({})
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        galleryItems,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch gallery items',
      error: error.message
    });
  }
};

// Get single gallery item (Public)
export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      res.status(404).json({
        status: 'error',
        message: 'Gallery item not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { galleryItem }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch gallery item',
      error: error.message
    });
  }
};

// Create gallery item (Admin)
export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const galleryItem = await Gallery.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Gallery item created successfully',
      data: { galleryItem }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create gallery item',
      error: error.message
    });
  }
};

// Update gallery item (Admin)
export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!galleryItem) {
      res.status(404).json({
        status: 'error',
        message: 'Gallery item not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Gallery item updated successfully',
      data: { galleryItem }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update gallery item',
      error: error.message
    });
  }
};

// Delete gallery item (Admin)
export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      res.status(404).json({
        status: 'error',
        message: 'Gallery item not found'
      });
      return;
    }

    console.log(`\n🗑️  Deleting property: ${galleryItem.title} (ID: ${galleryItem._id})`);

    // Delete associated images from disk
    if (galleryItem.images && galleryItem.images.length > 0) {
      console.log(`   Found ${galleryItem.images.length} images to delete`);
      deleteFiles(galleryItem.images);
    } else {
      console.log(`   No images to delete`);
    }

    // Delete property from database
    await galleryItem.deleteOne();
    console.log(`✅ Property deleted successfully\n`);

    res.status(200).json({
      status: 'success',
      message: 'Gallery item deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Failed to delete property:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete gallery item',
      error: error.message
    });
  }
};

// Upload gallery images (Admin)
export const uploadPropertyImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      res.status(404).json({
        status: 'error',
        message: 'Gallery item not found'
      });
      return;
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'No files uploaded'
      });
      return;
    }

    console.log(`📤 Received ${req.files.length} images for optimization...`);

    // Optimize images in parallel after upload
    try {
      const uploadsDir = path.join(__dirname, '../../uploads');
      const filePaths = req.files.map((file: Express.Multer.File) => 
        path.join(uploadsDir, file.filename)
      );
      
      await optimizeImages(filePaths);
    } catch (optimizeError: any) {
      console.error('Image optimization failed:', optimizeError.message);
      // Continue even if optimization fails - images are still uploaded
      console.warn('⚠️  Proceeding with unoptimized images');
    }

    // Get filenames
    const filenames = req.files.map((file: Express.Multer.File) => file.filename);
    
    // Add to gallery images
    galleryItem.images.push(...filenames);
    await galleryItem.save();

    res.status(200).json({
      status: 'success',
      message: 'Images uploaded and optimized successfully',
      data: {
        uploadedImages: filenames,
        totalImages: galleryItem.images.length
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

// Delete gallery image (Admin)
export const deletePropertyImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, filename } = req.params;
    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      res.status(404).json({
        status: 'error',
        message: 'Gallery item not found'
      });
      return;
    }

    // Remove image from array
    const imageIndex = galleryItem.images.indexOf(filename);
    if (imageIndex === -1) {
      res.status(404).json({
        status: 'error',
        message: 'Image not found'
      });
      return;
    }

    galleryItem.images.splice(imageIndex, 1);
    await galleryItem.save();

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
