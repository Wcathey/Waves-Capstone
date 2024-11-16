const express = require('express');
const { requireAuth } = require('../../utils/auth');
const {Playlist, Song, PlaylistSongs} = require('../../db/models');
const router = express.Router();

//get all playlists
router.get('/', async (req, res, next) => {
    const playlists = await Playlist.findAll({
        attributes: ["id", "name"]
    });
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
    const foundPlaylist = await Playlist.findByPk(req.params.playlistId, {
        attributes: ["id", "name"],
        include: [Song]
    });
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

//Update playlist by id
router.put('/:playlistId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const foundPlaylist = await Playlist.findByPk(req.params.playlistId);
    if(!foundPlaylist) {
        res.status(404);
        res.json({message: "Playlist couldnt be found"});
    }
    else if(foundPlaylist.userId !== user.id) {
        res.status(403);
        return res.json({message: "Forbidden: playlist belongs to a different User"})
    }
    else {
        const {name} = req.body;
        await Playlist.update({
            name: name
        },
        {
            where: {
                id: req.params.playlistId
            }
        });
        const updatedPlaylist = await Playlist.findByPk(req.params.playlistId);

        res.json(updatedPlaylist);
}
});

//delete playlist by id
router.delete('/:playlistId', requireAuth, async (req, res, next) => {
    const foundPlaylist = await Playlist.findByPk(req.params.playlistId);
    if(!foundPlaylist) {
        res.status(404);
        res.json({message: "Playlist couldnt be found"});
    }
    else {
        await Playlist.destroy({
            where: {
                id: req.params.playlistId
            }
        });
        res.json({message: "Playlist deleted successfully"})
    }
});

//delete song from playlist
router.delete('/:playlistId/songs/:songId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const checkUserPlaylist = await Playlist.findByPk(req.params.playlistId);
        if(checkUserPlaylist.userId !== user.id) {
            res.status(403);
           return res.json({message: "Forbidden: playlist belongs to a different User"})
        }
    const songOnPlaylist = await PlaylistSongs.findOne({
        where: {
            playlistId: req.params.playlistId,
            songId: req.params.songId
        }

    });
       if(!songOnPlaylist) {
            res.status(404);
            res.json({message: "Song couldnt be found on playlist"});
        }
       else {
        PlaylistSongs.destroy({
            where: {
                playlistId: req.params.playlistId,
                songId: req.params.songId
            }
        });
        res.json({message: "Song successfully removed from playlist"})
       }
})





module.exports = router;
