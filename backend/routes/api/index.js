const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const artistsRouter = require('./artists.js');
const albumsRouter = require('./albums.js');
const songsRouter = require('./songs.js');
const { restoreUser } = require("../../utils/auth.js");

//use restoruser function to find user from db if exists or make user null
//error will be thrown and not allow any other routes to be accessed that require login
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/artists', artistsRouter);

router.use('/albums', albumsRouter);

router.use('/songs', songsRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

module.exports = router;
