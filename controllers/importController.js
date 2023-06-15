const { validationResult, Result } = require('express-validator');
const bcrypt = require('bcryptjs');
const dbConnection = require('../utils/dbConnection');
const util = require("util");

// Import Page
exports.importPage = async (req, res, next) => {
    const [row] = await dbConnection.query('SELECT * FROM users WHERE id=?', {
      replacements: [req.session.userID],
    });
  
    if (row.length !== 1) {
      return res.redirect('/logout');
    }
  
  if(req.query.delete_id!=undefined){
    const [results] =  await dbConnection.query(
      'DELETE FROM imprt WHERE id = ?',
      {
      replacements: [req.query.delete_id],
      });
  }
  
    const [rw] = await dbConnection.query('SELECT * FROM imprt');
    
  
    res.render('home', {
      user: row[0],
     contacts:rw,
    //  contacts:searchQuery,
    });
  };