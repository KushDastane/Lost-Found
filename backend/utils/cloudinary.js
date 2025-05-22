const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');  // <-- add this import

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lost-and-found',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        resource_type: 'image',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});
  

module.exports = {
    cloudinary,
    storage
};
