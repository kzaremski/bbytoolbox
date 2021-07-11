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

// Set the PIN number for a particular user
router.post('/setpin', async (req, res) => {
  try {
    // Authenticate
    if (!req.session.employeenumber) throw 'No login session has been detected';
    if (!req.session.admin) throw 'You do not have admin access';
    // Validate
    if (!req.body.employeenumber) throw 'The employee number is undefined';
    if (!req.body.pin) throw 'The new PIN number is undefined';
    if (typeof req.body.pin != 'string' || req.body.pin.length != 4) throw 'The new PIN number is invalid';
    // Update database
    const employeenumber = req.body.employeenumber;
    const employee = await Employee.findOne({ number: employeenumber });
    if (!employee) throw 'The employee number is invalid'
    await Employee.findOneAndUpdate({ number: employeenumber }, { pin: req.body.pin });
    return res.send({ success: 'The employee\'s PIN number has been reset.' });
  } catch (err) {
    return res.send({ error: String(err) });
  }
});

router.post('/addemployee', async (req, res) => {
  try {
    // Authenticate
    if (!req.session.employeenumber) throw 'No login session has been detected';
    if (!req.session.admin) throw 'You do not have admin access';
    // Validate

    // Update database

    // Notify
  } catch (err) {
    return res.send({ error: String(err) });
  }
});

router.post('/editemployee', async (req, res) => {
  try {
    // Authenticate
    if (!req.session.employeenumber) throw 'No login session has been detected';
    if (!req.session.admin) throw 'You do not have admin access';
    // Validate
    if (!req.body.employeenumber) throw 'No employee is selected';
    // Update database
    const nametrim = req.body.name.replace(/\s+/g, ' ').trim();
    const namecapitalized = nametrim.replace(/\b\w/g, l => l.toUpperCase());
    await Employee.findOneAndUpdate({ number: req.body.employeenumber }, {
      name: namecapitalized,
      store: parseInt(req.body.store.replace(/\D/g, '')).toString(),
      disabled: req.body.disabled
    });
    // Notify
    return res.send({ success: 'Employee ' + req.body.employeenumber + ' was updated successfully.' });
  } catch (err) {
    return res.send({ error: String(err) });
  }
});

// Exporting the router to be used elsewhere
module.exports = router;