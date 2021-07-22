/**
 * BBY Toolbox
 * -- Admin MOTD Settings Router
 * -- Konstantin Zaremski
 * -- July 20, 2021
 */

// Require dependencies
const path = require('path');
const mongoose = require('mongoose');

const router = require('express').Router();

// Mongoose models
const Setting = require(path.join(__dirname, 'models/setting'));

// Set the new goals for today
router.post('/set', async (req, res) => {
  try {
    // Authenticate user and validate input
    if (!req.session.employeenumber) throw 'Session expired, you are not authenticated';
    if (!req.session.admin) throw 'You must be an administrator to set the MOTD';
    // Validate
    if (!req.body.hasOwnProperty('enabled') || typeof req.body.enabled != 'boolean') throw 'Submitted settings do not conform to type standards';
    if (!req.body.hasOwnProperty('content') || typeof req.body.content != 'string') throw 'Submitted settings do not conform to type standards';
    if (!req.body.hasOwnProperty('type') || typeof req.body.type != 'string') throw 'Submitted settings do not conform to type standards';
    // Save the settings
    await Setting.findOneAndUpdate({ name: 'motd_enabled' }, { value: req.body.enabled });
    await Setting.findOneAndUpdate({ name: 'motd_content' }, { value: req.body.content });
    await Setting.findOneAndUpdate({ name: 'motd_type' }, { value: req.body.type });
    // Notify the user if all is fine and dandy
    return res.send({ success: 'The MOTD settings have been updated' });
  } catch (err) {
    // Send back an error if there is any
    return res.send({ error: String(err) });
  }
});

// Get today's sales API endpoint
router.post('/get', async (req, res) => {
  try {
    // Authenticate user
    if (!req.session.employeenumber) throw 'Session expired, you are not authenticated';
    // Build response object from different settings
    const enabled = await Setting.findOne({ name: 'motd_enabled' });
    const content = await Setting.findOne({ name: 'motd_content' });
    const type = await Setting.findOne({ name: 'motd_type' });
    const response = {
      enabled: enabled.value,
      content: content.value,
      type: type.value
    }
    // Send back the current settings
    return res.send(response);
  } catch (err) {
    // Send back an error if there is any
    return res.send({ error: String(err) });
  }
});

// Exporting the router to be used elsewhere
module.exports = router;