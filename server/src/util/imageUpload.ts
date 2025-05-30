import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream'


    /**
     * Cloudinary config
     */
    cloudinary.config({ 
        cloud_name:  process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET 
    });
    /**
     * Uploads to the Cloudinary libary from a blob
     * @param imageBlob image from user
     * @returns an object with the image URLs and the ID
     */
    export const uploadBlob = async (imageBlob: Buffer) => {
        try {
          // Create a readable stream from the Blob (Buffer)
          const bufferStream = new stream.PassThrough();
          bufferStream.end(imageBlob);
      
          // Upload the Blob to Cloudinary using the upload_stream method
          const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { 
                folder: process.env.CLOUDINARY_FOLDER,
               },
              (error, result) => {
                if (error) {
                  reject(error); // Reject promise if there's an error
                } else {
                  resolve(result); // Resolve with upload result
                }
              }
            ).end(imageBlob); // End the stream by passing the Blob (Buffer)
          });
          const ImageID = uploadResult.public_id.split('/').slice(1).join('/');
          // Original image URL
          const ImageURL = uploadResult.secure_url;
      
          // Generate the smaller image URL (resize while maintaining aspect ratio)
          const SmallImageURL = cloudinary.url(process.env.CLOUDINARY_FOLDER+ImageID, {
            width: 300,  // Desired width for the smaller version
            height: 199,  // Desired height for the smaller version
            crop: 'fill', // Resize to fit within the given width and height
            gravity: 'auto', // Auto-adjust for best fit
            fetch_format: 'auto', // Auto-select format (like webp, jpg, png)
            quality: 'auto', // Auto-quality for efficient delivery
          });
      
          
          return {
            ImageURL,
            SmallImageURL,
            ImageID
          };
        } catch (error) {
          console.error('Error uploading Blob:', error);
          throw new Error("CLOUDINARY_ERROR");
        }
      };
      /**
       * Delets an image from the Cloudinary libary
       * @param imageID the id connected to the image
       * @returns a boolean stating if the deletion went through
       */
      export async function deleteImage(imageID: string): Promise<boolean> {
      try {
          const publicId = process.env.CLOUDINARY_FOLDER + imageID;
          console.log("Attempting to delete:", publicId);

          const result = await cloudinary.uploader.destroy(publicId); 
          console.log("Cloudinary delete result:", result);

          return result.result === 'ok';
      } catch (error) {
          console.error('Error deleting image:', error);
          return false;
    }
    }