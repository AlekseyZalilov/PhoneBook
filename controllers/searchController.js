const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dbConnection = require('../utils/dbConnection');
const util = require('util');

exports.searchPage = async (req, res, next) => {
  console.log(req.session)
    const [row] = await dbConnection.query('SELECT * FROM users WHERE id = ?', {
      replacements: [req.session.userID],
    });
  
    if (row.length !== 1) {
      return res.redirect('/logout');
    }
  
    const [results] =  await dbConnection.query(
      'SELECT * FROM contacts WHERE\
      surname ILIKE \'% ? %\' OR\
      name ILIKE \'% :res %\' OR\
      patronymic ILIKE \'% :res %\' OR\
      primaryp ILIKE \'% :res %\' OR\
      additional ILIKE \'% :res %\' OR\
      job ILIKE \'% :res %\' OR\
      service ILIKE \'% :res %\' OR\
      shop ILIKE \'% :res %\' OR\
      site ILIKE \'% :res %\' ',
      {
      replacements: [req.query.searchQuery],
      });

    console.log(results);
  
    res.render('home', {
      user: row[0],
     contacts : results,
    });
  };