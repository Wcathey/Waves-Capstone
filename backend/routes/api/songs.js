const express = require('express');
const {Song, Artist} = require('../../db/models');
const {requireAuth} = require('../../utils/auth');
const {validateSong} = require('../../utils/validation');
const router = express.Router();

//Get all songs
router.get('/', async (req, res, next) => {
    const songs = await Song.findAll();
    return res.json(songs);
})

//Get all songs of current user
router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req;
    const songs = await Song.findAll({
        include: [
            {
                model: Artist,
                attributes: ["name", "memberId"],
                where: {
                    memberId: user.id
                }
            }
        ]

    });
    res.json(songs);
})

//Get song by songId
router.get('/:songId', async (req, res, next) => {
    const foundSong = Song.findByPk(req.params.songId);
    if(!foundSong) {
        res.status(404);
        res.json({message: "Song couldnt be found"});
    }
    else {
        res.status(201);
        res.json(foundSong);
    }
});

//Update song by songId
router.put('/:songId', requireAuth, validateSong, async (req, res, next) => {
    const {name, releaseDate, trackId} = req.body;
    const {user} = req;
    const songToUpdate = Song.findByPk(req.params.songId, {
        include: [
            Artist
        ]
    });
    if(!songToUpdate) {
        res.status(404);
        res.json({message: "Song couldnt be found"});
    }
    if(user.id !== songToUpdate.Artist.memberId) {
        res.status(403);
        res.json({message: "Forbidden"});
    }
    else {
        await Song.update(
            {
                name: name,
                releaseDate: releaseDate,
                trackId
            },
            {
                where: {
                    id: songToUpdate.id
                }
            }
        );
        const getSong = await Song.findByPk(req.params.songId);
        res.json(getSong);
    }

});

//Delete song by songId
router.delete('/:songId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const songToDelete = await Song.findByPk(req.params.songId, {
        include: {
            Artist
        }
    });
    if(!songToDelete) {
        res.status(404);
        res.json({message: "Song couldnt be found"});
    }
    if(user.id !== songToDelete.Artist.memberId) {
        res.status(403);
        res.json({message: "Forbidden"});
    }
    else {
        await Song.destroy({
            where: {
                id: songToDelete.id
            }
        });
        res.json({message: "Successfully deleted"});
    }
})

module.exports = router;
