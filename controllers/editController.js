const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dbConnection = require('../utils/dbConnection');
const util = require('util');

// Edit Page
exports.editPage = async(req, res, next) => {
  const [rw] = await dbConnection.query('SELECT * FROM contacts WHERE id=?',{

      replacements: [
        req.query.id, 
      ],
    }
  );


  return res.render('update', {
    edit: rw[0],
  });
};

// EditContact Page
exports.edit = async (req, res, next) => {
  const errors = validationResult(req);
  const { body } = req;

  if (!errors.isEmpty()) {
    return res.render('update', {
      error: errors.array()[0].msg,
    });
  }

  try {
    const [row] = await dbConnection.query(
      'UPDATE contacts SET image=?, surname=?, name=?, patronymic=?, primaryp=?, additional=?, job=?, service=?, shop=?, site=? WHERE id = ?',
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
          req.query.id, 
        ],
      }
    );

    if (row.length >= 1) {
      return res.render('update', {
        error: 'surname failed.',
      });
    }

    //   const hashPass = await bcrypt.hash(body._password, 5);


    const [rw] = await dbConnection.query('SELECT * FROM contacts WHERE id=?',{

      replacements: [
        req.query.id, 
      ],
    }
  );

    res.render('update', {
      mesage: 'You have successfully update contact.',
      edit: rw[0],
    });
  } catch (e) {
    next(e);
  }
};
