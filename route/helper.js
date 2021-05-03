const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');



// save image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/product')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + '.' + file.mimetype.split('/')[1];
        cb(null, fileName);
    }
});
const upload = multer({
    storage: storage
});

// resize image to stream
const resize = (path, format, width, height) => {
    const readStream = fs.createReadStream(path)
    let transform = sharp()
    if (format) {
        transform = transform.toFormat(format)
    }
    if (width || height) {
        transform = transform.resize(width, height)
    }
    return readStream.pipe(transform)
}



module.exports = {
    upload,
    resize
}