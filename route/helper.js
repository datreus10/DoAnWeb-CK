const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');


// save image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload')
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
const resize = (keyId, format, width, height) => {
    const readStream = getFileStream(keyId);
    let transform = sharp()
    if (format) {
        transform = transform.toFormat(format)
    }
    if (width || height) {
        transform = transform.resize(width, height)
    }
    return readStream.pipe(transform)
}


// amazon s3 config
require('dotenv').config()
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

// uploads a file to s3
const uploadFile = file => {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
}

// downloads a file from s3
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream()
}



module.exports = {
    upload,
    resize,
    uploadFile,
    getFileStream
}