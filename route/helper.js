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





// // amazon s3 config
// require('dotenv').config()
// const {
//     BlobServiceClient,
//     generateBlobSASQueryParameters,
//     StorageSharedKeyCredential,
//     BlobSASPermissions
// } = require("@azure/storage-blob");
// const accountName = process.env.AZURE_ACCOUNT_NAME
// const containerName = process.env.AZURE_CONTAINER_NAME
// const accountKey = process.env.AZURE_ACCOUNT_KEY

// const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// // uploads a file to amzon blob
// const uploadFile = async file => {
//     const blobServiceClient = new BlobServiceClient(
//         `https://${accountName}.blob.core.windows.net`,
//         sharedKeyCredential
//     );
//     const fileStream = fs.createReadStream(file.path)
//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     const blockBlobClient = containerClient.getBlockBlobClient(file.filename);
//     return blockBlobClient.uploadStream(fileStream, file.size);
// }

// // get file link 
// const getFileLink = (fileName) => {
//     const blobServiceClient = new BlobServiceClient(
//         `https://${accountName}.blob.core.windows.net`,
//         sharedKeyCredential
//     );
//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     const blockBlobClient = containerClient.getBlockBlobClient(fileName);
//     const startDate = new Date();
//     const expiryDate = new Date(startDate);
//     expiryDate.setMinutes(startDate.getMinutes() + 100);
//     startDate.setMinutes(startDate.getMinutes() - 100);
//     return blockBlobClient.url + "?" + generateBlobSASQueryParameters({
//             containerName: containerName, // Required
//             blobName: fileName, // Required
//             permissions: BlobSASPermissions.parse("r"), // Required
//             startsOn: startDate, //Date.now(), // Required
//             expiresOn: expiryDate //new Date(new Date().valueOf() + 86400) // Optional. Date type (1 ngày)
//         },
//         sharedKeyCredential // StorageSharedKeyCredential - `new StorageSharedKeyCredential(account, accountKey)`
//     ).toString();
// }

module.exports = {
    upload
}