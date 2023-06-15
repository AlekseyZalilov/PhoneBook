const { validationResult, Result } = require('express-validator');
const bcrypt = require('bcryptjs');
const dbConnection = require('../utils/dbConnection');
const util = require('util');

// Val Page
exports.valPage = async (req, res, next) => {
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

  console.log(row[0].role);
  const [rw] =
    row[0].role == 'admin'
      ? await dbConnection.query('SELECT * FROM contacts WHERE val=true')
      : await dbConnection.query('SELECT * FROM contacts WHERE valu=true');

  res.render('home', {
    user: row[0],
    contacts: rw,
    //  contacts:searchQuery,
  });
};
