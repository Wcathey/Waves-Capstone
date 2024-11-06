const { validationResult } = require('express-validator');
const { check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateSignup = [
    check('firstName')
      .exists({checkFalsy: true})
      .withMessage("First Name is required"),
    check('lastName')
      .exists({checkFalsy: true})
      .withMessage("Last Name is required"),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
      check('isArtist')
      .exists({checkFalsy: true})
      .isBoolean()
      .withMessage('isArtist must be true or false'),
    handleValidationErrors
  ];

  const validateArtist = [
    check('name')
    .exists({checkFalsy: true})
    .withMessage('Name is required'),
    check('city')
    .exists({checkFalsy: true})
    .withMessage("City is required"),
    check('state')
    .exists({checkfalsy: true})
    .withMessage('State is required'),
    check('genre')
    .exists({checkfalsy: true})
    .withMessage('Genre must be Other if no genre is selected'),
    check('bio')
    .exists({checkfalsy: true})
    .isLength({min: 10, max: 256})
    .withMessage("Bio must be 10 to 256 characters"),
    check("label")
    .exists({checkfalsy: true})
    .withMessage("Please put N/A for label if no label"),
    handleValidationErrors
  ]

  const validateAlbum = [
    check('name')
    .exists({checkfalsy: true})
    .withMessage('Name is required'),
    check('releaseDate')
    .exists({checkfalsy: true})
    .isDate()
    .isBefore(new Date().toString())
    .withMessage('Date cant be in the future')
  ]

  module.exports = {
    handleValidationErrors, validateSignup, validateArtist, validateAlbum
  }
