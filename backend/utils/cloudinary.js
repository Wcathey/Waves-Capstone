const {cloudinaryConfig} = require('../config')
const cloudinary = require('cloudinary').v2;

const {cloud_name, api_key, api_secret} = cloudinaryConfig
cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret
});

module.exports = cloudinary;
