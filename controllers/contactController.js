const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dbConnection = require('../utils/dbConnection');
const util = require('util');

// Create Page
exports.createPage = (req, res, next) => {
  res.render('create');
};

// CreateContact Page
exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  const { body } = req;

  if (!errors.isEmpty()) {
    return res.render('create', {
      error: errors.array()[0].msg,
    });
  }

  try {
    const [row] = await dbConnection.query(
      'SELECT * FROM contacts WHERE surname=?',
      {
        replacements: [body._surname],
      }
    );

    if (row.length >= 1) {
      return res.render('create', {
        error: 'surname failed.',
      });
    }

    //   const hashPass = await bcrypt.hash(body._password, 5);

    const [rows] = await dbConnection.query(
      'INSERT INTO contacts(image,surname,name,patronymic,primaryp,additional,job,service,shop,site,val,valu) VALUES(?,?,?,?,?,?,?,?,?,?,false,false)',
      {
        replacements: [
          body._image,
          body._surname,
          body._name,
          body._patronymic,
          body._primaryp,
          body._additional,
          body._job,
          body._service,
          body._shop,
          body._site,
        ],
      }
    );

    res.render('create', {
      mesage: 'You have successfully create contact.',
    });
  } catch (e) {
    next(e);
  }
};

