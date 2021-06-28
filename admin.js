/**
 * 164 Toolbox
 * -- Konstantin Zaremski
 * -- June 27, 2021
 * -- See details in LICENSE
 */

// Require dependencies
const path = require('path');
const mongoose = require('mongoose');

const router = require('express').Router();

// Mongoose Models
const Employee = require(path.join(__dirname, 'models/employee'));

// Get all employees
router.post('/getusers', async (req, res) => {
  // Authenticate
  if (!req.session.employeenumber) return res.send({ error: 'No login session has been detected' });
  if (!req.session.admin) return res.send({ error: 'You do not have admin access' });
  try {
    const users = await Employee.find();
    return res.send({ users: users });
  } catch (err) {
    return res.send({ error: String(err) });
  }
});

// Exporting the router to be used elsewhere
module.exports = router;