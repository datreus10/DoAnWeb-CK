const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage
});

const resizeAndSaveTo = async (file, height, width, path) => {
    fs.mkdirSync(path, {
        recursive: true
    });
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + '.' + file.mimetype.split('/')[1];
    await sharp(file.buffer).resize({
        height: height,
        width: width
    }).toFile(path + `/${fileName}`);
    return fileName;
}

module.exports = {
    upload,
    resizeAndSaveTo
}