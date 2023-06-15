const { validationResult, Result } = require('express-validator');
const bcrypt = require('bcryptjs');
const dbConnection = require('../utils/dbConnection');
const util = require('util');

// Home Page
exports.homePage = async (req, res, next) => {
  const [row] = await dbConnection.query('SELECT * FROM users WHERE id=?', {
    replacements: [req.session.userID],
  });

  if (row.length !== 1) {
    return res.redirect('/logout');
  }

  if (req.query.delete_id != undefined) {
    const [results] = await dbConnection.query(
      'DELETE FROM contacts WHERE id = ?',
      {
        replacements: [req.query.delete_id],
      }
    );
  }
  if (req.query.val_id != undefined) {
    const [results] =
      row[0].role == 'admin'
        ? await dbConnection.query(
            'UPDATE contacts SET val = NOT val WHERE id = ?',
            {
              replacements: [req.query.val_id],
            }
          )
        : await dbConnection.query(
            'UPDATE contacts SET valu = NOT valu WHERE id = ?',
            {
              replacements: [req.query.val_id],
            }
          );
  }

  const [rw] = await dbConnection.query('SELECT * FROM contacts');

  res.render('home', {
    user: row[0],
    contacts: rw,
    //  contacts:searchQuery,
  });
};

// Register Page
exports.registerPage = (req, res, next) => {
  res.render('register');
};

// User Registration
exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  const { body } = req;

  if (!errors.isEmpty()) {
    return res.render('register', {
      error: errors.array()[0].msg,
    });
  }

  try {
    const [row] = await dbConnection.query(
      'SELECT * FROM users WHERE email=?',
      {
        replacements: [body._email],
      }
    );

    if (row.length >= 1) {
      return res.render('register', {
        error: 'Данная электронаая почта уже используется.',
      });
    }

    const hashPass = await bcrypt.hash(body._password, 5);

    const [rows] = await dbConnection.query(
      'INSERT INTO users(name,email,password) VALUES(?,?,?)',
      {
        replacements: [body._name, body._email, hashPass],
      }
    );

    res.render('register', {
      msg: 'Вы успешно зарегестрированы.',
    });
  } catch (e) {
    next(e);
  }
};

// Login Page
exports.loginPage = (req, res, next) => {
  res.render('login');
};

// Login User
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  const { body } = req;

  if (!errors.isEmpty()) {
    return res.render('login', {
      error: errors.array()[0].msg,
    });
  }

  try {
    const [row] = await dbConnection.query(
      'SELECT * FROM users WHERE email=?',
      {
        replacements: [body._email],
      }
    );

    if (row.length != 1) {
      return res.render('login', {
        error: 'Неверная электронная почта.',
      });
    }

    const checkPass = await bcrypt.compare(body._password, row[0].password);

    if (checkPass === true) {
      req.session.userID = row[0].id;
      return res.redirect('/');
    }

    res.render('login', {
      error: 'Неверный пароль.',
    });
  } catch (e) {
    next(e);
  }
};
