const express = require('express');
const { requireAuth } = require('../../utils/auth');
const {Playlist, Song, PlaylistSongs} = require('../../db/models');
const playlist = require('../../db/models/playlist');
const router = express.Router();

//get all playlists
router.get('/', async (req, res, next) => {
    const playlists = await Playlist.findAll();
    return res.json(playlists);
});

//Get playlists of current user
router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req;
    const playlists = await Playlist.findAll({
        where: {
            userId: user.id
        }
    });
    res.json(playlists);
});

//Get playlist by id
router.get('/:playlistId', async (req, res, next) => {
    const foundPlaylist = await Playlist.findByPk(req.params.playlistId);
    if(!foundPlaylist) {
        res.status(404);
        res.json({message: "Playlist couldnt be found"});
    }
    else {
        res.status(201);
        res.json(foundPlaylist);
    }
});

//Create new playlist
router.post('/', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {name} = req.body;
    const newPlaylist = await Playlist.create({
        name: name,
        userId: user.id
    });
    return res.status(201).json(newPlaylist);
})

//Add a song to playlist
router.post('/:playlistId/songs', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {songId} = req.body;
    const foundPlaylist = await Playlist.findByPk(req.params.playlistId);
    const foundSong = await Song.findByPk(songId);

    if(!foundPlaylist) {
        res.status(404);
        res.json({message: "Playlist couldnt be found"});
    }
    else if(foundPlaylist && foundPlaylist.userId !== user.id) {
        res.status(403);
        res.json({message: "Forbiddin: Playlist belongs to a different User"});
    }
    else if(!foundSong) {
            res.status(404);
            res.json({message: "Song couldnt be found"});
        }
    else {
       const addedSong = await PlaylistSongs.create({
            playlistId: foundPlaylist.id,
            songId: foundSong.id
       });


       res.status(201);
       res.json(addedSong)
    }
});

//Get all songs on a playlist
router.get('/:playlistId/songs', requireAuth, async (req, res, next) => {
    const foundPlaylist = await Playlist.findByPk(req.params.playlistId);
    if(!foundPlaylist) {
        res.status(404);
        res.json({message: "Playlist couldnt be found"});
    }
    else {
        const songList = PlaylistSongs.findAll({
            include: [Song],
            attributes: ["songId"],
            where: {
                playlistId: req.params.playlistId
            }
        });
        res.status(201);
        res.json(songList)
    }
})





module.exports = router;
