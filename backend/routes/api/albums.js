const express = require('express');
const { Album, Artist } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateAlbum } = require('../../utils/validation');
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
                attributes: ["name", "plays", "memberId"],
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

    const foundAlbum = await Album.findByPk(req.params.albumId);
    if (!foundAlbum) {
        res.status(404);
        res.json({ message: "Album couldnt be found" })
    }
    else {
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







module.exports = router;
