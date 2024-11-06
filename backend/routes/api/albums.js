const express = require('express');
const { Album, Artist, Song } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateAlbum, validateSong } = require('../../utils/validation');
const router = express.Router();

//Get all Albums
router.get('/', async (req, res, next) => {
    const albums = await Album.findAll();
    return res.json(albums);
});
//Get albums of current User
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const albums = await Album.findAll({
        include: [
            {
                model: Artist,
                attributes: ["name", "memberId"],
                where: {
                    memberId: user.id
                }
            }
        ]
    })

    res.json(albums)
});

//Get album by id
router.get('/:albumId', async (req, res, next) => {

    const foundAlbum = await Album.findByPk(req.params.albumId, {
        include: [Artist, Song]
    });
    if (!foundAlbum) {
        res.status(404);
        res.json({ message: "Album couldnt be found" })
    }
    else {
        res.status(201);
        res.json(foundAlbum);
    }
});

//Update and return existing album
router.put('/:albumId', requireAuth, validateAlbum, async (req, res, next) => {
    const { name, releaseDate } = req.body;
    const { user } = req;
    const albumToUpdate = await Album.findByPk(req.params.albumId, {
        include: [
            Artist
        ]
    });
    if (!albumToUpdate) {
        res.status(404);
        res.json({ message: "Album couldnt be found" });
    }
    if (albumToUpdate.Artist.memberId !== user.id) {
        res.status(403);
        res.json({ message: "Forbidden" })
    }
    else {
        await Album.update(
            {
                name: name,
                releaseDate: releaseDate
            },
            {
                where: {
                    id: req.params.albumId
                }
            }
        );
        const getAlbum = await Album.findByPk(req.params.albumId);
        res.json(getAlbum)
    }
});

//Delete album by id
router.delete('/:albumId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const albumToDelete = await Album.findByPk(req.params.albumId, {
        include: [
            Artist
        ]
    });

    if(!albumToDelete) {
        res.status(404);
        res.json({message: "Album couldnt be found"});
    }
    if(user.id !== albumToDelete.Artist.memberId) {
        res.status(403);
        res.json({message: "Forbidden"});
    }
    else {
        await Album.destroy({
            where: {
                id: albumToDelete.id
            }
        });
        res.json({message: "Successfully deleted"})
    }
})

//Add song to album by album id
router.post('/:albumId/songs', requireAuth, validateSong, async (req, res, next) => {
    const {name, releaseDate, trackId} = req.body;
    const {user} = req;
    const foundAlbum = Album.findByPk(req.params.songId, {
        include: [
            Artist
        ]
    });
    if(!foundAlbum) {
        res.status(404);
        res.json({message: "Album couldnt be found"});
    }
    if(user.id !== foundAlbum.Artist.memberId) {
        res.status(403);
        res.json({message: "Forbidden"});
    }
    else {
        const newSong = await Song.create({
            name: name,
            releaseDate: releaseDate,
            albumId: foundAlbum.id,
            artistId: foundAlbum.Artist.id,
            trackId: trackId,
            totalPlays: 0

        });
        res.status(201);
        res.json({newSong});
    }
})





module.exports = router;
