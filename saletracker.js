/**
 * 164 Toolbox
 * -- Konstantin Zaremski
 * -- June 19, 2021
 * -- See details in LICENSE
 */

// Require dependencies
const path = require('path');
const mongoose = require('mongoose');
const startOfDay = require('date-fns/startOfDay');
const endOfDay = require('date-fns/endOfDay');

const router = require('express').Router();

// Mongoose models
const ComputingSale = require('./models/computingsale');

// Submit new sale API endpoint
router.post('/submitsale', async (req, res) => {
  try {
    // Authenticate user and validate input
    if (!req.session.employeenumber) throw 'Session expired, you are not authenticated.';
    if (!req.body.sale) throw 'The new sale object is undefined.';
    // New sale
    let units = {};
    const allowedunits = ['oem', 'office', 'surface', 'tts', 'bp'];
    if (typeof req.body.sale === 'object' && Object.keys(req.body.sale).length > 0) for (const unit in req.body.sale) {
      // If the unit within the sale is an allowed category, and it's value is a number, add it to the units object for the new sale
      if (allowedunits.includes(unit) && typeof req.body.sale[unit] === 'number') units[unit] = req.body.sale[unit];
    }
    // Set the employee object
    const employee = {
      number: req.session.employeenumber,
      name: req.session.employeename
    };
    // Build the new sale object and create a document within the database collection
    const sale = {
      date: new Date(),
      employee: employee,
      units: units
    }
    await new ComputingSale(sale).save();
    // Notify the user if all is fine and dandy
    return res.send({ success: 'Your new sale has been recorded!' });
  } catch(err) {
    // Send back an error if there is any
    return res.send({ error: String(err) });
  }
});

// Get today's sales API endpoint
router.post('/getsales', async (req, res) => {
  try {
    // Authenticate user
    if (!req.session.employeenumber) throw 'Session expired, you are not authenticated.';
    // Identify bounding datetimes
    const now = new Date();
    const begin = startOfDay(now);
    const end = endOfDay(now);
    // Find all matching documents using a MongoDB aggregation pipeline
    let sales = await ComputingSale.aggregate([{
      "$match": {
        "date": { "$gte": begin, "$lt": end }
      }
    }]);
    // Return the results to the user
    return res.send({ sales: sales });
  } catch(err) {
    // Send back an error if there is any
    return res.send({ error: String(err) });
  }
});

// Exporting the router to be used elsewhere
module.exports = router;