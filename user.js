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

router.post('/changepin', async (req, res) => {
  if (!req.session.employeenumber) return res.send({ error: 'Employee number is not valid' });
  if (!req.body.oldpin) return res.send({ error: 'PIN is incorrect' });
  if (!req.body.newpin) return res.send({ error: 'New PIN is invalid' });
  try {
    const employee = await Employee.findOne({ number: req.session.employeenumber });
    if (employee.pin != req.body.oldpin) throw 'Current PIN is incorrect';
    if (req.body.newpin.length != 4) throw 'New PIN is invalid';
    await Employee.findOneAndUpdate({ number: req.session.employeenumber }, { pin: req.body.newpin });
    res.send({ success: 'Your PIN has been changed!' });
  } catch (err) {
    res.send({ error: String(err) });
  }
});

// Exporting the router to be used elsewhere
module.exports = router;