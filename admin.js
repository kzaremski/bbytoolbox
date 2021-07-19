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
const Store = require(path.join(__dirname, 'models/store'));

/**
 * EMPLOYEES
 */

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

router.post('/newemployee', async (req, res) => {
  try {
    // Authenticate
    if (!req.session.employeenumber) throw 'No login session has been detected';
    if (!req.session.admin) throw 'You do not have admin access';
    // Validate
    if (!req.body.number) throw 'Employee number is not defined';
    if (!req.body.name) throw 'Employee name is not defined';
    if (!req.body.store) throw 'No primary store has been provided';
    if (!req.body.pin || req.body.pin.replace(' ', '').length === 0) throw 'Employee login PIN is not set';
    // Update database
    const nametrim = req.body.name.replace(/\s+/g, ' ').trim();
    const namecapitalized = nametrim.replace(/\b\w/g, l => l.toUpperCase());
    await new Employee({
      number: parseInt(req.body.number.replace(/\D/g, '')).toString(),
      name: namecapitalized,
      store: parseInt(req.body.store.replace(/\D/g, '')).toString(),
      disabled: req.body.disabled || false,
      admin: false,
      multistore: false,
      storeadmin: false,
      pin: req.body.pin
    }).save();
    // Notify
    return res.send({ success: 'Employee ' + req.body.number.trim() + ' has been added!' });
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

/**
 * STORES
 */
router.post('/newstore', async (req, res) => {
  try {
    // Authenticate
    if (!req.session.employeenumber) throw 'No login session has been detected';
    if (!req.session.admin) throw 'You do not have admin access';
    // Validate
    if (!req.body.number) throw 'Store number is not defined';
    // Check for existing stores
    const storenumber = parseInt(req.body.number.replace(/\s+/g, ' ').trim()).toString();
    const existing = await Store.findOne({ number: storenumber });
    if (existing) throw 'A store already exists with that location number';
    // Validate
    if (!req.body.name) throw 'Store location name is not defined';
    if (!req.body.timezone) throw 'Store timezone is not defined';
    // Insert new store into database
    const blankstore = {
      number: '',
      name: '',
      district: '',
      timezone: '',
      address: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: ''
      }
    }
    const newstore = { ...blankstore, ...req.body, number: storenumber }
    await new Store(newstore).save();
    // Notify
    return res.send({ success: 'Location ' + storenumber + ' has been added!' });
  } catch (err) {
    return res.send({ error: String(err) });
  }
});

router.post('/editstore', async (req, res) => {
  try {
    // Authenticate
    if (!req.session.employeenumber) throw 'No login session has been detected';
    if (!req.session.admin) throw 'You do not have admin access';
    // Validate
    if (!req.body.number) throw 'No store is selected';
    // Check for existing stores
    const storenumber = parseInt(req.body.number.replace(/\s+/g, ' ').trim()).toString();
    console.log
    const existing = await Store.findOne({ number: storenumber });
    if (!existing) throw 'A store does not exist with that number';
    // Validate
    if (!req.body.name) throw 'Store location name is not defined';
    if (!req.body.timezone) throw 'Store timezone is not defined';
    // Update database
    const cast = { ...req.body, number: storenumber };
    await Store.findOneAndUpdate({ number: storenumber }, cast);
    // Notify
    return res.send({ success: 'Location ' + storenumber + ' was updated successfully.' });
  } catch (err) {
    return res.send({ error: String(err) });
  }
});

// Exporting the router to be used elsewhere
module.exports = router;