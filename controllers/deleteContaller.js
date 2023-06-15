const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dbConnection = require('../utils/dbConnection');
const util = require('util');

exports.delet = async (req, res, next) => {
    const [row] = await dbConnection.query('SELECT * FROM contacts WHERE id=?', {
      replacements: [req.query.id],
    });
  

    const [results] =  await dbConnection.query(
      'DELETE FROM users WHERE id = ?;',
      {
      replacements: {res:req.query.searchQuery},
      });

    console.log(results);
  
    res.render('home', {
     contacts:results,
    });
  };