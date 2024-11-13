const express = require('express');
const router = express.Router();
const upload = require('../../utils/multer')
const cloudinaryUploader = require('../../utils/cloudinaryUploader')
const { requireAuth } = require('../../utils/auth');
const {Song, Upload} = require('../../db/models');
router.post("/", requireAuth, upload, async (req, res) => {
    const {user} = req;
    const song = await Song.findOne({
        where: {
            name: req.file.display_name
        }
    });
    if(user.isArtist === false) {
        res.status(403);
        res.json({message: "Forbidden: Invalid account type"});
    }
    else if(req.fileValidationError) {
        return res
            .status(500)
            .json({message: `File validation error: ${req.fileValidationError}`});
    }
    else if(!song) {
        res.status(404);
        res.json({message: "Song couldnt be found"});
    }

    else {


    const audioResponse = await cloudinaryUploader(req, res);
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

module.exports = router;
