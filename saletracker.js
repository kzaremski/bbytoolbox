/**
 * BBY Toolbox
 * -- Konstantin Zaremski
 * -- June 19, 2021
 * -- See details in LICENSE
 */

// Require dependencies
const path = require('path');
const mongoose = require('mongoose');
const startOfDay = require('date-fns/startOfDay');
const endOfDay = require('date-fns/endOfDay');
const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');

const router = require('express').Router();

// Mongoose models
const ComputingSale = require('./models/computingsale');
const ComputingSaleGoal = require('./models/computingsalegoal');

// Submit new sale API endpoint
router.post('/submitsale', async (req, res) => {
  try {
    // Authenticate user and validate input
    if (!req.session.employeenumber) throw 'Session expired, you are not authenticated.';
    if (!req.body.sale) throw 'The new sale object is undefined.';
    // New sale
    let units = {};
    const allowedunits = ['oem', 'office', 'surface', 'tts', 'bp'];
    if (req.body.hasOwnProperty('sale') && typeof req.body.sale === 'object' && Object.keys(req.body.sale).length > 0) for (const unit in req.body.sale) {
      // If the unit within the sale is an allowed category, and it's value is a number, add it to the units object for the new sale
      if (allowedunits.includes(unit) && typeof req.body.sale[unit] === 'number') units[unit] = req.body.sale[unit];
    }
    // Set the employee object
    const employee = req.body.otheremployee ? {
      name: 'Other',
      number: 0,
    } : {
      number: req.session.employeenumber,
      name: req.session.employeename
    };
    // Identify the timezone
    let timezone = 'America/Denver';
    if (req.body.hasOwnProperty('timezone')) timezone = req.body.timezone;
    // Build the new sale object and create a document within the database collection
    const sale = {
      // Hard assumption of mountain time
      date: utcToZonedTime(new Date().toISOString(), timezone),
      store: req.session.store,
      timezone: timezone,
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

// Set the new goals for today
router.post('/submitgoals', async (req, res) => {
  try {
    // Authenticate user and validate input
    if (!req.session.employeenumber) throw 'Session expired, you are not authenticated.';
    if (!req.body.goals) throw 'The goals object is undefined.';
    // New goals
    let units = {};
    const allowedunits = ['oem', 'office', 'surface', 'tts', 'bp'];
    if (req.body.hasOwnProperty('goals') && typeof req.body.goals === 'object' && Object.keys(req.body.goals).length > 0) for (const unit in req.body.goals) {
      // If the unit within the sale is an allowed category, and it's value is a number, add it to the units object for the new sale
      if (allowedunits.includes(unit) && typeof req.body.goals[unit] === 'number') units[unit] = req.body.goals[unit];
    }
    // See if there are already goals for today
    const currentgoals = await ComputingSaleGoal.findOne({ date: utcToZonedTime(new Date().toISOString(), 'America/Denver').toISOString().split('T')[0] });
    if (!currentgoals) {
      const newgoals = {
        date: utcToZonedTime(new Date().toISOString(), 'America/Denver').toISOString().split('T')[0],
        modified: [
          {
            employee: {
              number: req.session.employeenumber,
              name: req.session.employeename
            },
            date: new Date()
          }
        ],
        store: req.session.store,
        units: units
      };
      await new ComputingSaleGoal(newgoals).save();
    } else {
      // Add a new entry to the list of people that modified the goals
      let newmodified = currentgoals.modified;
      newmodified.push({
        employee: {
          number: req.session.employeenumber,
          name: req.session.employeename
        },
        date: new Date()
      });
      // Define what needs to be updated
      const newgoals = {
        modified: newmodified,
        units: units
      };
      // Find the record and update it
      await ComputingSaleGoal.findOneAndUpdate({ date: utcToZonedTime(new Date().toISOString(), 'America/Denver').toISOString().split('T')[0], store: req.session.store }, newgoals);
    }
    // Notify the user if all is fine and dandy
    return res.send({ success: 'Todays goals have been updated!' });
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
    // Identify the timezone
    let timezone = 'America/Denver';
    if (req.body.hasOwnProperty('timezone')) timezone = req.body.timezone;
    // Identify bounding datetimes
    const now = utcToZonedTime(new Date().toISOString(), timezone);
    const begin = startOfDay(now);
    const end = endOfDay(now);
    // Find all matching documents using a MongoDB aggregation pipeline
    let sales = await ComputingSale.aggregate([{
      "$match": {
        "date": { "$gte": begin, "$lt": end },
      }
    }]);
    // Filter out manually by store
    sales.filter((sale) => {
      return sale.store === req.session.store
    });
    // Find today's sales goals
    let goals = await ComputingSaleGoal.findOne({ store: req.session.store, date: utcToZonedTime(new Date().toISOString(), 'America/Denver').toISOString().split('T')[0] });
    if (goals) goals = goals.units; 
    // Return the results to the user
    return res.send({ sales: sales, goals: goals });
  } catch(err) {
    // Send back an error if there is any
    return res.send({ error: String(err) });
  }
});

// Exporting the router to be used elsewhere
module.exports = router;