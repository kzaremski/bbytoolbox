/**
 * BBY Toolbox
 * -- Automatic Reporting Engine
 * -- Konstantin Zaremski
 * -- July 22, 2021
 */

// Require dependencies
const path = require('path');
const mongoose = require('mongoose');

const cron = require('node-cron');

const router = require('express').Router();

// Mongoose models
const Report            = require(path.join(__dirname, 'models/report'));
const ComputingSale     = require(path.join(__dirname, 'models/computingsale'));
const ComputingSaleGoal = require(path.join(__dirname, 'models/computingsalegoal'));
const Employee          = require(path.join(__dirname, 'models/employee'));
const Store             = require(path.join(__dirname, 'models/store'));
const Setting           = require(path.join(__dirname, 'models/setting'));

async function runDailyReport() {
  try {
    // For each store get all sales from the previous day
    const stores = await Store.find();
    stores.forEach(store => {
      let today = new Date();
    });
  } catch (err) {
    return console.log('There was an error running the daily report:\n' + String(err));
  }
}

// Run the report every day at 12:00PM UTC (at this time all US time zones are on the same 'next' day)
cron.schedule('* * * * *', async () => {
  console.log('  Scheduled job started! Running daily sales report @ ' + new Date().toISOString());
  runDailyReport();
});

// List stored reports
router.post('/list', async (req, res) => {
  try {
    // Authenticate user
    if (!req.session.employeenumber) throw 'Session expired, you are not authenticated';
    if (!req.session.admin) throw 'You must have admin priveleges to view reports';
    
    return res.send(response);
  } catch (err) {
    // Send back an error if there is any
    return res.send({ error: String(err) });
  }
});

// Get a specific report
router.post('/get', async (req, res) => {
  try {
    // Authenticate user
    if (!req.session.employeenumber) throw 'Session expired, you are not authenticated';
    if (!req.session.admin) throw 'You must have admin priveleges to view reports';
    
    return res.send(response);
  } catch (err) {
    // Send back an error if there is any
    return res.send({ error: String(err) });
  }
});

// Exporting the router to be used elsewhere
module.exports = router;