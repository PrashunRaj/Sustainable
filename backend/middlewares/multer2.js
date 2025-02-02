import multer from 'multer';

// Define storage configuration
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname); // Keep the original file name
    }
});

// Multer instance for handling specific fields
const uploadVideoWithThumbnail = multer({ storage }).fields([
    { name: 'thumbnail', maxCount: 1 }, // Field for thumbnail (image)
    { name: 'video', maxCount: 1 }      // Field for video file
]);

export default uploadVideoWithThumbnail;
