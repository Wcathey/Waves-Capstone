const express = require('express');
const {Artist, Album} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {validateArtist, validateAlbum} = require('../../utils/validation');
const router = express.Router();

//Get all artists
router.get('/', async (req, res, next) => {
    const artists = await Artist.findAll();
    return res.json(artists);
});

//Get artists of current user
router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req;
    const artists = await Artist.findAll({
        where: {
            memberId: user.id
        }
    });
    console.log(artists)
    res.json(artists);
})


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

//Get all albums by artist id
router.get('/:artistId/albums', async (req, res, rext) => {
    const artist = await Artist.findByPk(req.params.artistId);
    if(!artist) {
        res.status(404);
        res.json({message: "Artist couldnt be found"});
    }
    else {
        const albums = await Album.findAll({
            where: {
                artistId: artist.id
            }
        });
        res.json(albums);
    }
})

//add album to artist by artist id
router.post('/:artistId/albums', requireAuth, validateAlbum, async (req, res, next) => {
    const {user} = req;
    const artist = await Artist.findByPk(req.params.artistId);

    if(!artist) {
        res.status(404);
        res.json({message: "Artist couldnt be found"});
    }

    if(user.id !== artist.memberId) {
        res.status(403);
        res.json({message: "Forbidden"})
    }
    else {
        const {name, releaseDate} = req.body;

        const newAlbum = await Album.create({
            name: name,
            releaseDate: releaseDate,
            artistId: artist.id
        });
        res.status(201);
        res.json(newAlbum)
    }
});


router.post('/', requireAuth, validateArtist, async (req, res, next) => {
    const {user} = req;
    if(!user.isArtist) {
        res.status(403);
        res.json({message: "Forbidden: Invalid account type"});
    }
    else {
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
        genre: genre,
        bio: bio,
        label: label,
        memberId: user.id
    });
    res.status(201);
    res.json({newArtist});
}
})

router.put('/:artistId', requireAuth, validateArtist, async (req, res, next) => {
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
