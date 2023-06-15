const router = require('express').Router();
const { body } = require('express-validator');
const multer = require('multer');
// const { role } = require("express-validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single('image');

const {
  homePage,
  register,
  registerPage,
  login,
  loginPage,
} = require('./controllers/userController');

const { create, createPage } = require('./controllers/contactController');
const dbConnection = require('./utils/dbConnection');
const { search, searchPage } = require('./controllers/searchController');
const { importPage } = require('./controllers/importController');
const { valPage } = require('./controllers/valController');
const { edit, editPage } = require('./controllers/editController');
const ifNotLoggedin = (req, res, next) => {
  if (!req.session.userID) {
    return res.redirect('/login');
  }
  next();
};

const ifLoggedin = (req, res, next) => {
  if (req.session.userID) {
    return res.redirect('/');
  }
  next();
};

const ifNotCreate = (req, res, next) => {
  if (!req.session.userID) {
    return res.redirect('/login');
  }
  next();
};

const ifCreate = (req, res, next) => {
  // if (req.session.userID) {
  //   return res.redirect('/create');
  // }
  next();
};

router.get('/', ifNotLoggedin, homePage);
router.get('/import', ifNotLoggedin, importPage);

router.get('/val', ifNotLoggedin, valPage);

router.get('/login', ifLoggedin, loginPage);
router.post(
  '/login',
  ifLoggedin,
  [
    body('_email', 'Неверная электроння почта')
      .notEmpty()
      .escape()
      .trim()
      .isEmail(),
    body('_password', 'Пароль должен содержать миниму 4 символа')
      .notEmpty()
      .trim()
      .isLength({ min: 4 }),
  ],
  login
);

router.get('/signup', ifLoggedin, registerPage);
router.post(
  '/signup',
  ifLoggedin,
  [
    body('_name', 'Имя должно быть не менее 3 симоволов')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_email', 'Неверная электроння почта')
      .notEmpty()
      .escape()
      .trim()
      .isEmail(),
    body('_password', 'Пароль должен содержать миниму 4 символа')
      .notEmpty()
      .trim()
      .isLength({ min: 4 }),
  ],
  register
);

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    next(err);
  });
  res.redirect('/login');
});

//CRUD
// id:
// image:
// surname:
// name:
// patronymic:
// primaryp:
// additional:
// job:
// service:
// shop:
// site:

router.get('/create', ifCreate, createPage, upload);
router.post(
  '/create',
  ifCreate,
  [
    body('_image', 'Fhoto plz').notEmpty(),
    body('_surname', 'Invalid surname')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_name', 'Invalid name')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_patronymic', 'Invalid patronymic')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_primaryp', 'Invalid primaryp')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_additional', 'Invalid additional')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_job', 'Invalid job').notEmpty().escape().trim().isLength({ min: 3 }),
    body('_service', 'Invalid service')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_shop', 'Invalid shop')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_site', 'Invalid site')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
  ],
  create
);

router.get('/search', ifCreate, upload);

router.get('/update', ifCreate, editPage, upload);
router.post(
  '/update',
  ifCreate,
  [
    body('_image', 'Fhoto plz').notEmpty(),
    body('_surname', 'Invalid surname')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_name', 'Invalid name')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_patronymic', 'Invalid patronymic')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_primaryp', 'Invalid primaryp')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_additional', 'Invalid additional')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_job', 'Invalid job').notEmpty().escape().trim().isLength({ min: 3 }),
    body('_service', 'Invalid service')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_shop', 'Invalid shop')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body('_site', 'Invalid site')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
  ],
  edit
);

// site:

router.get('/search', ifCreate, searchPage);


module.exports = router;
