// const multer = require('multer');
// const path = require('path');

// // Set storage engine
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // store in backend/uploads
//     },
//     filename: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
//         cb(null, uniqueName);
//     }
// });

// // File filter (optional): only allow images
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed!'), false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter
// });

// module.exports = upload;

const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

module.exports = upload;

