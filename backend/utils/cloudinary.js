// import { v2 as cloudinary } from 'cloudinary';

// export const uploadToCloudinary = async () => {
    
// //     // Configuration
// cloudinary.config({ 
//     cloud_name:process.env.CLOUD_NAME, 
//     api_key: process.env.API_KEY,
//     api_secret:process.env.API_SECRET,
//     // API_environment_variable: 'CLOUDINARY_URL=cloudinary://759838971523454:mbTVye7c8xOiHagy5Qdy2bWGjKY@dcd0m83qf'
// });
    
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            {
//                public_id: public_id,
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
//      const uploadToCloudinary = async (path, folder = "my-profile") => {
//         try {
//           const data = await cloudinary.uploader.upload(path, { folder: folder });
//           return { url: data.secure_url, publicId: data.public_id };
//         } catch (err) {
//           console.log(err);
//           throw err;
//         }
//       };
//       module.exports = { uploadToCloudinary}
      
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// // })();
// }

// // export const uploadToCloudinary = async (path, folder = "my-profile") => {
// //     cloudinary.config({ 
// //         cloud_name:process.env.CLOUD_NAME, 
// //         api_key: process.env.API_KEY,
// //         api_secret:process.env.API_SECRET,
// //         // API_environment_variable: 'CLOUDINARY_URL=cloudinary://759838971523454:mbTVye7c8xOiHagy5Qdy2bWGjKY@dcd0m83qf'
// //     });
// //     try {
// //       const data = await cloudinary.uploader.upload(path, { folder: folder });
// //       return { url: data.secure_url, publicId: data.public_id };
// //     } catch (err) {
// //       console.log(err);
// //       throw err;
// //     }
// //   }; 
// //   module.exports = { uploadToCloudinary}

import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = async (path, folder = "my-profile") =>{

    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY,
        api_secret:process.env.API_SECRET,
    });
    
    // Upload an image
    const data = await cloudinary.uploader.upload(path, { folder: folder });
    console.log(data);
    
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
    return { url: data.secure_url, publicId: data.public_id };
}