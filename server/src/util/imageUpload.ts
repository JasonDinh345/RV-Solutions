import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream'

    // Configuration
    cloudinary.config({ 
        cloud_name:  process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET 
    });
    // Function to upload an image and return both original and smaller version URLs
    export const uploadBlob = async (imageBlob: Buffer, publicId: string) => {
        try {
          // Create a readable stream from the Blob (Buffer)
          const bufferStream = new stream.PassThrough();
          bufferStream.end(imageBlob);
      
          // Upload the Blob to Cloudinary using the upload_stream method
          const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { public_id: publicId },
              (error, result) => {
                if (error) {
                  reject(error); // Reject promise if there's an error
                } else {
                  resolve(result); // Resolve with upload result
                }
              }
            ).end(imageBlob); // End the stream by passing the Blob (Buffer)
          });
      
          // Original image URL
          const originalUrl = uploadResult.secure_url;
      
          // Generate the smaller image URL (resize while maintaining aspect ratio)
          const smallerUrl = cloudinary.url(publicId, {
            width: 300,  // Desired width for the smaller version
            height: 199.5,  // Desired height for the smaller version
            crop: 'fill', // Resize to fit within the given width and height
            gravity: 'auto', // Auto-adjust for best fit
            fetch_format: 'auto', // Auto-select format (like webp, jpg, png)
            quality: 'auto', // Auto-quality for efficient delivery
          });
      
          // Return both URLs
          return {
            originalUrl,
            smallerUrl
          };
        } catch (error) {
          console.error('Error uploading Blob:', error);
          throw new Error("CLOUDINARY_ERROR");
        }
      };
      export async function deleteImage(imageID: string): Promise<boolean>{
        await cloudinary.uploader.destroy(imageID, (error, result) => {
            if (error) {
              console.error('Error deleting image:', error);
            } 
            return result === 'ok'
          });
          return false
      }