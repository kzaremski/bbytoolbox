/**
 * BBY Toolbox
 *  Konstantin Zaremski
 *  July 9, 2021
 * 
 * See details in LICENSE.
 */

// Require depende+ncies
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const helmet = require('helmet');

// Express app object
const app = express();

// Load environment configuration variables from a file if in development mode
if (app.get('env') != 'production') require('dotenv').config({ path: path.join(__dirname, 'dev.env') });

// Determine settings of the application from environment variables
const PIN_AUTH_ENABLED = process.env.PIN && process.env.PIN.toLowerCase() == 'yes';

// Configure nunjucks
nunjucks.configure('views', {
  noCache: true,
  watch: true,
  autoescape: true,
  express: app
});
app.set('views', path.join(__dirname, 'views'));

// Express security
app.use(helmet({ contentSecurityPolicy: false }));

// Configure body parser
app.use(bodyParser.urlencoded({ extended: true }), bodyParser.json());

app.set('trust proxy', true);

// Configure server side sessions
if (app.get('env') === 'production') app.set('trust proxy', 1);
app.use(session({
  secret: 'A' + Math.random(),
  expires: new Date(Date.now() + (12 * 60 * 60 * 1000)),
  resave: false,
  saveUninitialized: true
}));

// Static assets and files
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/build', express.static(path.join(__dirname, 'build')));

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, (err) => {
  // If there was an error, obviously we are not connected
  if (!err) return console.log('Connected to MongoDB');
  console.log('Unable to connect to MongoDB');
});

// Mongoose models
const Employee = require(path.join(__dirname, 'models/employee'));
const Store = require(path.join(__dirname, 'models/store'));
const IPAddress = require(path.join(__dirname, 'models/ipaddress'));
const Login = require(path.join(__dirname, 'models/login'));
const Setting = require(path.join(__dirname, 'models/setting'));

// All regular HTTP requests are delivered the main view
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, '/index.html')) });

// Applications
app.use('/saletracker', require('./saletracker.js'));
app.use('/user', require('./user.js'));
app.use('/admin', require('./admin.js'));
app.use('/motd', require('./motd.js'));
app.use('/report', require('./report.js'));

// Get current account status
app.post('/currentuser', async (req, res) => {
  res.send({
    employeenumber: req.session.employeenumber,
    employeename: req.session.employeename,
    admin: req.session.admin,
    store: req.session.store,
    multistore: req.session.multistore
  });
});

// Get system settings
app.post('/systemsettings', async (req, res) => {
  res.send({
    pinauth: PIN_AUTH_ENABLED
  });
});

// Get a list of all locations
app.post('/getstores', async (req, res) => {
  try {
    if (!req.session.employeenumber) throw 'You need to be logged in to access this information';
    let stores = await Store.find();
    return res.send({ stores: stores });
  } catch (err) {
    return res.send({ error: String(err) });
  }
});

// Change the current store if multistore
app.post('/changestore', async (req, res) => {
  try {
    if (!req.session.employeenumber) throw 'You need to be logged in to change stores';
    if (!req.body.store) throw 'No store selected';
    if (!req.session.multistore) throw 'You are not permitted to change stores';
    const store = await Store.find({ number: req.body.store });
    if (!store) throw 'The selected store does not exist';
    req.session.store = req.body.store;
    return res.send({ success: 'Your current store has been changed' });
  } catch (err) {
    return res.send({ error: String(err) });
  }
});

// Login database operations
async function login(employeenumber, pinnumber) {
  try {
    if (employeenumber === null || typeof employeenumber != 'string' || employeenumber.length < 1) throw 'Employee number is not valid';
    if (PIN_AUTH_ENABLED && (pinnumber === null || typeof pinnumber != 'string' || pinnumber.length < 4)) throw 'PIN is incorrect';
    let employee = await Employee.findOne({ number: employeenumber.trim() });
    if (!employee) throw 'Employee number is not valid';
    if (employee.disabled) throw 'Access has been disabled for this employee number';
    if (PIN_AUTH_ENABLED && (employee.pin != pinnumber)) throw 'PIN is incorrect';
    return {
      success: true,
      name: employee.name,
      number: employee.number,
      store: employee.store,
      multistore: employee.multistore,
      admin: employee.admin
    };
  } catch (err) {
    return { error: String(err) };
  }
}

// Login API endpoint
app.post('/login', (req, res) => {
  if (!req.body.employeenumber) return res.send({ error: 'Employee number is not valid' });
  if (PIN_AUTH_ENABLED && !req.body.pinnumber) return res.send({ error: 'PIN is incorrect' });
  login(req.body.employeenumber, PIN_AUTH_ENABLED ? req.body.pinnumber : null).then((response) => {
    if (response.success) {
      // Record the login
      Login.create({
        ip: req.ip,
        date: new Date(),
        employee: response.number
      });
      // Set the server side session
      req.session.employeename = response.name;
      req.session.employeenumber = response.number;
      req.session.store = response.store;
      req.session.multistore = response.multistore;
      req.session.admin = response.admin;
    }
    res.send(response);
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.send({ success: true });
})

// Listen to HTTP requests
app.listen((process.env.PORT || 3000), async () => {
  console.log(`Express app listening at http://127.0.0.1:${(process.env.PORT || 3000)}`);
  // Set default settings if they are not set
  try {
    // MOTD Enabled (to show or not)
    let settings = await Setting.find({ name: 'motd_enabled' });
    if (settings.length === 0) await new Setting({ name: 'motd_enabled', value: false }).save();
    // MOTD Content
    settings = await Setting.find({ name: 'motd_content' });
    if (settings.length === 0) await new Setting({ name: 'motd_content', value: '' }).save();
    // MOTD Type
    settings = await Setting.find({ name: 'motd_type' });
    if (settings.length === 0) await new Setting({ name: 'motd_type', value: 'primary' }).save();
    // Automatic Reporting Enabled?
    settings = await Setting.find({ name: 'automatic_reporting_enabled' });
    if (settings.length === 0) await new Setting({ name: 'automatic_reporting_enabled', value: false }).save();
    // Send reports by email?
    settings = await Setting.find({ name: 'report_email_sending_enabled' });
    if (settings.length === 0) await new Setting({ name: 'report_email_sending_enabled', value: false }).save();
    // Report Email Recipients
    settings = await Setting.find({ name: 'report_email_recipients' });
    if (settings.length === 0) await new Setting({ name: 'report_email_recipients', value: [] }).save();
  } catch (err) {
    console.log('Error: ' + err);
  }
});