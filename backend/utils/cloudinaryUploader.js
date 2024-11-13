const cloudinary = require("./cloudinary");

const cloudinaryUploader = async (req, res) => {;

const file = req.file;

if(!file) {
    return res.status(400).json({message: "File not found"})
}
const fName = file.originalname.split(".")[0];

try {
    const uploadAudio = await cloudinary.uploader.upload(file.path, {
        resource_type: "raw",
        public_id: `waves/${fName}`,
    });

    return uploadAudio
} catch(error) {
    console.log(error);
    return res.status(500).json({message: error.message});
}
};

module.exports = cloudinaryUploader;
