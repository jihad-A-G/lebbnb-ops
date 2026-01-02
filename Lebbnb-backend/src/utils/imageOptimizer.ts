import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

/**
 * Image optimization configuration
 */
const IMAGE_OPTIMIZATION_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1920,
  jpegQuality: 80,
  pngQuality: 80,
  webpQuality: 80,
  progressive: true,
  // Remove metadata to reduce file size
  stripMetadata: true
};

/**
 * Optimize a single image file
 * - Resizes to maximum dimensions while maintaining aspect ratio
 * - Compresses with optimal quality settings
 * - Converts to progressive format for faster loading
 * - Removes metadata (EXIF, etc.) to reduce file size
 * 
 * @param filePath - Absolute path to the image file
 * @returns Promise that resolves when optimization is complete
 */
export const optimizeImage = async (filePath: string): Promise<void> => {
  try {
    const tempPath = filePath + '.temp';
    const ext = path.extname(filePath).toLowerCase();

    // Get image metadata to check current size
    const metadata = await sharp(filePath).metadata();
    
    // Skip optimization if image is already small enough
    const needsResize = metadata.width && metadata.width > IMAGE_OPTIMIZATION_CONFIG.maxWidth;
    const needsOptimization = true; // Always optimize for compression

    if (!needsResize && !needsOptimization) {
      console.log(`Image already optimized: ${path.basename(filePath)}`);
      return;
    }

    // Create Sharp instance with resize
    let pipeline = sharp(filePath)
      .resize(IMAGE_OPTIMIZATION_CONFIG.maxWidth, IMAGE_OPTIMIZATION_CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });

    // Remove metadata if configured
    if (IMAGE_OPTIMIZATION_CONFIG.stripMetadata) {
      pipeline = pipeline.rotate(); // Auto-rotate based on EXIF, then remove EXIF
    }

    // Apply format-specific optimizations
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        pipeline = pipeline.jpeg({
          quality: IMAGE_OPTIMIZATION_CONFIG.jpegQuality,
          progressive: IMAGE_OPTIMIZATION_CONFIG.progressive,
          mozjpeg: true // Use mozjpeg for better compression
        });
        break;

      case '.png':
        pipeline = pipeline.png({
          quality: IMAGE_OPTIMIZATION_CONFIG.pngQuality,
          compressionLevel: 9,
          progressive: IMAGE_OPTIMIZATION_CONFIG.progressive
        });
        break;

      case '.webp':
        pipeline = pipeline.webp({
          quality: IMAGE_OPTIMIZATION_CONFIG.webpQuality
        });
        break;

      case '.gif':
        // GIFs are not optimized by Sharp, skip
        console.log(`Skipping GIF optimization: ${path.basename(filePath)}`);
        return;

      default:
        // For other formats, convert to JPEG
        pipeline = pipeline.jpeg({
          quality: IMAGE_OPTIMIZATION_CONFIG.jpegQuality,
          progressive: IMAGE_OPTIMIZATION_CONFIG.progressive
        });
    }

    // Save optimized image to temp file
    await pipeline.toFile(tempPath);

    // Get file sizes for logging
    const originalStats = await fs.stat(filePath);
    const optimizedStats = await fs.stat(tempPath);
    const savedBytes = originalStats.size - optimizedStats.size;
    const savedPercent = Math.round((savedBytes / originalStats.size) * 100);

    // Replace original with optimized
    await fs.unlink(filePath);
    await fs.rename(tempPath, filePath);

    console.log(
      `✓ Optimized: ${path.basename(filePath)} | ` +
      `${(originalStats.size / 1024).toFixed(1)}KB → ${(optimizedStats.size / 1024).toFixed(1)}KB | ` +
      `Saved ${savedPercent}% (${(savedBytes / 1024).toFixed(1)}KB)`
    );
  } catch (error: any) {
    console.error(`Error optimizing image ${filePath}:`, error.message);
    
    // Clean up temp file if it exists
    const tempPath = filePath + '.temp';
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore if temp file doesn't exist
    }
    
    // Re-throw error to handle upstream
    throw new Error(`Image optimization failed: ${error.message}`);
  }
};

/**
 * Optimize multiple images in parallel
 * 
 * @param filePaths - Array of absolute paths to image files
 * @returns Promise that resolves when all optimizations are complete
 */
export const optimizeImages = async (filePaths: string[]): Promise<void> => {
  console.log(`\n📸 Optimizing ${filePaths.length} images...`);
  const startTime = Date.now();

  try {
    // Process images in parallel for better performance
    await Promise.all(filePaths.map(filePath => optimizeImage(filePath)));
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ All images optimized in ${duration}s\n`);
  } catch (error: any) {
    console.error('Error optimizing images:', error.message);
    throw error;
  }
};

/**
 * Create a thumbnail version of an image
 * Useful for property listing pages
 * 
 * @param sourcePath - Path to source image
 * @param thumbnailPath - Path where thumbnail should be saved
 * @param size - Thumbnail size (default: 400px)
 */
export const createThumbnail = async (
  sourcePath: string,
  thumbnailPath: string,
  size: number = 400
): Promise<void> => {
  try {
    await sharp(sourcePath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 75,
        progressive: true
      })
      .toFile(thumbnailPath);

    console.log(`✓ Created thumbnail: ${path.basename(thumbnailPath)}`);
  } catch (error: any) {
    console.error(`Error creating thumbnail for ${sourcePath}:`, error.message);
    throw new Error(`Thumbnail creation failed: ${error.message}`);
  }
};
