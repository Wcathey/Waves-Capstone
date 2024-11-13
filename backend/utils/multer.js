const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        let fileExt = file.originalname.split(".").pop();

        const fileName = `${new Date().getTime()}.${fileExt}`;

        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
//check for file type and return response
    if(file.mimetype !== "audio/mpeg" && file.mimetype !== "audip/mp3") {
        req.fileValidationError = "File type must be audio/mp3 or audio/mpeg"

        return cb(null, false, req.fileValidationError);
    } else {
        //if file type is correct calls next function
        cb(null, true);
    }
};

const upload = multer({
    storage,
    fileFilter
}).single("audio");

module.exports = upload;
