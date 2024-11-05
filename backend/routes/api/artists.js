const express = require('express');
const {Artist} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//Get all artists
router.get('/', async (req, res, next) => {
    const artists = await Artist.findAll();
    return res.json(artists);
});
//Get artist by id
router.get('/:artistId', async (req, res, next) => {

    const foundArtist = await Artist.findByPk(req.params.artistId);
    if(!foundArtist) {
        res.status(404);
        res.json({message: "Artist couldnt be found"})
    }
    else {
        res.json(foundArtist);
    }
});

router.post('/', requireAuth, async (req, res, next) => {
    const {user} = req;
    if(user.isArtist === false) {
        res.status(403);
        res.json({message: "Forbidden"});
    }
    const {
        name,
        city,
        state,
        genre,
        bio,
        label
    } = req.body;

    const newArtist = await Artist.create({
        name: name,
        city: city,
        state: state,
        plays: 0,
        genre: genre,
        bio: bio,
        label: label,
        memberId: user.id
    });
    res.status(201);
    res.json({newArtist});
})

router.put('/artistId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const artist = await Artist.findByPk(req.params.artistId);
    if(!artist) {
        res.status(404);
        res.json({message: "Artist couldnt be found"});
    }
    if(user.id !== artist.memberId) {
        res.status(403);
        res.json({message: "Forbidden"});
    }
    else {
        const {name, city, state, genre, bio, label} = req.body
        await Artist.update({
            name: name,
            city: city,
            state: state,
            genre: genre,
            bio: bio,
            label: label
        },
    {
        where: {
            id: req.params.artistId
        }
    });
    const updatedArtist = await Artist.findByPk(req.params.artistId);

    return res.json(updatedArtist)
    }

});

router.delete('/:artistId', requireAuth, async (req, res, next) => {
    const {user} = req
    const artist = await Artist.findByPk(req.params.artistId);
    if(!artist) {
        res.status(404);
        res.json({message: "Artist couldnt be found"});
    }
    if(user.id !== artist.memberId) {
        res.status(403);
        res.json({message: "Forbidden"});
    }
    else {
        await Artist.destroy({
            where: {
                id: req.params.artistId
            }
        });

        res.json({message: "Successfully deleted"});
    }
})
module.exports = router;
