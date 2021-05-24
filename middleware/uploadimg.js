import multer from 'multer'

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'public/img/product/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	  },
})
export const upload = multer({ storage: storage, fileFilter: imageFilter })


