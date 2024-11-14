const express = require('express');
const router = express.Router();
const upload = require('../../utils/multer')
const {cloudinaryUploader, cloudinaryDeleter} = require('../../utils/cloudinaryCRUD')
const { requireAuth } = require('../../utils/auth');
const {Song, Upload} = require('../../db/models');


router.post("/", requireAuth, upload, async (req, res) => {
    const {user} = req;

    if(user.isArtist === false) {
        res.status(403);
        res.json({message: "Forbidden: Invalid account type"});
    }
    else if(req.fileValidationError) {
        return res
            .status(500)
            .json({message: `File validation error: ${req.fileValidationError}`});
    }

    else {


    const audioResponse = await cloudinaryUploader(req, res);
    const song = await Song.findOne({
        where: {
            name: audioResponse.display_name
        }
    });
    if(!song) {
        res.status(404);
        return res.json({message: "Song couldnt be found"});
    }
    const uploadedSongData = await Upload.create({
        songId: song.id,
        asset_id: audioResponse.asset_id,
        public_id: audioResponse.public_id,
        version: audioResponse.version,
        version_id: audioResponse.version_id,
        signature: audioResponse.signature,
        resource_type: audioResponse.resource_type,
        bytes: audioResponse.bytes,
        etag: audioResponse.etag,
        placeholder: audioResponse.placeholder,
        url: audioResponse.url,
        secure_url: audioResponse.secure_url,
        asset_folder: audioResponse.asset_folder,
        display_name: audioResponse.display_name,
        original_filename: audioResponse.original_filename
    });



    return res.status(201).json({uploadedSongData});
    }
});

router.delete('/:uploadId', requireAuth, async (req, res) => {
    const uploadToDelete = await Upload.findByPk(req.params.uploadId);
    if(!uploadToDelete) {
        res.status(404);
        res.json({message: "Upload couldnt be found"});
    }
    else {
        await cloudinaryDeleter(req, res);
        
    }
})

module.exports = router;
