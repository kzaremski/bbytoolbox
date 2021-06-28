/**
 * 164 Tool Box
 * -- Konstantin Zaremski
 * -- June 9, 2021
 * -- Licensed under the MIT license
 * 
 * Copyright 2021 Konstantin Zaremski
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Require dependencies
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
if (app.get('env') != 'production') require('dotenv').config({ path: path.join(__dirname, 'dev.env')});

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
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  app.use(session({
    secret: 'A' + Math.random(),
    expires: new Date(Date.now() + (12 * 60 * 60 * 1000)),
    resave: false,
    saveUninitialized: true,
  }));
} else {
  app.use(session({
    secret: 'A' + Math.random(),
    expires: new Date(Date.now() + (12 * 60 * 60 * 1000)),
    resave: false,
    saveUninitialized: true
  }));
}

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
const IPAddress = require(path.join(__dirname, 'models/ipaddress'));
const Login = require(path.join(__dirname, 'models/login'));

// All regular HTTP requests are delivered the main view
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, '/index.html')) });

// Applications
app.use('/saletracker', require('./saletracker.js'));
app.use('/user', require('./user.js'));
app.use('/admin', require('./admin.js'));

// Get current account status
app.post('/currentuser', async (req, res) => {
  res.send({
    employeenumber: req.session.employeenumber,
    employeename: req.session.employeename,
    admin: req.session.admin
  });
});

// Login database operations
async function login(employeenumber, pinnumber) {
  try {
    if (employeenumber === null || typeof employeenumber != 'string' || employeenumber.length < 1) throw 'Employee number is not valid';
    if (pinnumber === null || typeof pinnumber != 'string' || pinnumber.length < 4) throw 'PIN is incorrect';
    let employee = await Employee.findOne({ number: employeenumber.trim() });
    if (!employee) throw 'Employee number is not valid';
    if (employee.disabled) throw 'Access has been disabled for this employee number';
    if (employee.pin != pinnumber) throw 'PIN is incorrect';
    return {
      success: true,
      name: employee.name,
      number: employee.number,
      admin: employee.admin
    };
  } catch(err) {
    return { error: String(err) };
  }
}

// Login API endpoint
app.post('/login', (req, res) => {
  if (!req.body.employeenumber) return res.send({ error: 'Employee number is not valid' });
  if (!req.body.pinnumber) return res.send({ error: 'PIN is incorrect' });
  login(req.body.employeenumber, req.body.pinnumber).then((response) => {
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
app.listen((process.env.PORT || 3000), () => { console.log(`Express app listening at http://127.0.0.1:${(process.env.PORT || 3000)}`); });