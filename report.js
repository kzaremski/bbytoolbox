/**
 * BBY Toolbox
 * -- Automatic Reporting Engine
 * -- Konstantin Zaremski
 * -- July 22, 2021
 */

// Require dependencies
const path = require('path');
const mongoose = require('mongoose');
const startOfDay = require('date-fns/startOfDay');
const endOfDay = require('date-fns/endOfDay');
const subDays = require('date-fns/subDays');
const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');
const cron = require('node-cron');
const excel = require('excel4node');

// Set up mailgun
const mg_domain = 'mail.zaremski.net';
const mg_apikey = 'ec83406d9067a3a325eada56b6039bdd-a0cfb957-cc1c2c69';
const mailgun = require('mailgun-js')({
  apiKey: mg_apikey,
  domain: mg_domain
});

const router = require('express').Router();

// Mongoose models
const Report = require(path.join(__dirname, 'models/report'));
const ComputingSale = require(path.join(__dirname, 'models/computingsale'));
const ComputingSaleGoal = require(path.join(__dirname, 'models/computingsalegoal'));
const Employee = require(path.join(__dirname, 'models/employee'));
const Store = require(path.join(__dirname, 'models/store'));
const Setting = require(path.join(__dirname, 'models/setting'));

// Guid generator
function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}

// Email a specific report to the recipients
async function emailReport(reportid) {
  try {
    // Make sure that the emial report sending option is enabled
    const report_email_sending_enabled = await Setting.findOne({ name: 'report_email_sending_enabled' });
    if (!report_email_sending_enabled.value) return;

    // Get a list of who we are sending the report to
    const emailrecipients = await Setting.findOne({ name: 'report_email_recipients' });
    if (emailrecipients.value.length < 1) return;

    console.log('  Emailing the daily report to recipients...');

    // Get the report
    const report = await Report.findOne({ guid: reportid });

    const message = {
      from: '"BBY Toolbox Reporting" <noreply.reporting@zaremski.net>',
      to: emailrecipients.value.join(', '),
      subject: `BBY Toolbox Daily Report (${report.filename})`,
      text: `Yesterday\'s report finished running at ${report.date.toISOString()}. Open the attached XLSX file to see the numbers.\n\n`,
      attachment: new mailgun.Attachment({
        data: Buffer.from(report.data, 'base64'),
        filename: report.filename,
        contentType: report.format
      })
    };
    await mailgun.messages().send(message);

    // Notify
    console.log(`  Sent daily report to ${emailrecipients.value.join(', ')} @ ${new Date().toISOString()}`);
  } catch (err) {
    return console.log('There was an error emailing the report:\n' + String(err));
  }
}

// Generate a daily report for the previous day and save it in the database
async function runDailyReport() {
  try {
    const reportid = guidGenerator();
    // Start the excel workbook
    let workbook = new excel.Workbook({ author: 'Sales Toolbox' });
    // Define styles
    let regular = workbook.createStyle({
      font: {
        bold: false,
        color: '#000000',
        size: 12,
      }
    });
    let bold = workbook.createStyle({
      font: {
        bold: true,
        color: '#000000',
        size: 12,
      }
    });
    // For each store get all sales from the previous day
    const stores = await Store.find();
    for (const store of stores) {
      // Calculate dates
      const now = utcToZonedTime(new Date().toISOString(), store.timezone);
      const yesterday = subDays(now, 1);
      const begin = startOfDay(yesterday);
      const end = endOfDay(yesterday);

      // Start worksheet
      let worksheet = workbook.addWorksheet(`Loc. ${store.number} (D${store.district})`);
      worksheet.cell(1, 1).string(`Location ${store.number} Computing Department End Of Day Sale Unit Totals`).style(bold);
      worksheet.cell(2, 1).string(`Report for ${yesterday.toISOString().split('T')[0]}`).style(regular);
      worksheet.cell(3, 1).string(`Employee`).style(bold);
      worksheet.cell(3, 2).string(`OEM`).style(bold);
      worksheet.cell(3, 3).string(`Office`).style(bold);
      worksheet.cell(3, 4).string(`Surface`).style(bold);
      worksheet.cell(3, 5).string(`TTS`).style(bold);
      worksheet.cell(3, 6).string(`BP`).style(bold);

      // Get all goals for that store
      let dbgoals = await ComputingSaleGoal.findOne({ store: store.number, date: yesterday.toISOString().split('T')[0] });
      let goals = Object.assign({
        oem: 0,
        office: 0,
        surface: 0,
        tts: 0,
        bp: 0
      }, dbgoals ? dbgoals.units : {});
      
      // Find all matching documents using a MongoDB aggregation pipeline
      let sales = await ComputingSale.aggregate([{
        "$match": {
          "date": { "$gte": begin, "$lt": end },
        }
      }]);

      // Filter out manually by store
      sales = sales.filter((sale) => {
        return sale.store === store.number
      });

      // Add all units from individual sales into unified counts
      let salestoday = {
        oem: 0,
        office: 0,
        surface: 0,
        tts: 0,
        bp: 0
      };

      // Calculate totals
      let salesbyemployee = {};
      // Create entries for all of the employees
      for (const sale of sales) { salesbyemployee[sale.employee.number] = { ...salestoday, name: sale.employee.name } }

      // Loop through and add
      for (const sale of sales) {
        for (const unit in sale.units) {
          salestoday[unit] += sale.units[unit];
          salesbyemployee[sale.employee.number][unit] += sale.units[unit];
        }
      }

      // Output a row for each employee in the object
      for (const employeenumber of Object.keys(salesbyemployee)) {
        const theirsales = salesbyemployee[employeenumber];
        const fNameL = salesbyemployee[employeenumber].name.split(' ').length > 1 ? salesbyemployee[employeenumber].name.split(' ')[0] + ' ' + salesbyemployee[employeenumber].name.split(' ')[1].substring(0, 1) + '.' : salesbyemployee[employeenumber].name;
        const position = 4 + Object.keys(salesbyemployee).indexOf(employeenumber);
        worksheet.cell(position, 1).string(`${fNameL}`).style(regular);
        worksheet.cell(position, 2).number(theirsales.oem).style(regular);
        worksheet.cell(position, 3).number(theirsales.office).style(regular);
        worksheet.cell(position, 4).number(theirsales.surface).style(regular);
        worksheet.cell(position, 5).number(theirsales.tts).style(regular);
        worksheet.cell(position, 6).number(theirsales.bp).style(regular);
      };

      // Totals after detail
      worksheet.cell(4 + Object.keys(salesbyemployee).length, 1).string(`Totals`).style(bold);
      worksheet.cell(4 + Object.keys(salesbyemployee).length, 2).number(salestoday.oem).style(regular);
      worksheet.cell(4 + Object.keys(salesbyemployee).length, 3).number(salestoday.office).style(regular);
      worksheet.cell(4 + Object.keys(salesbyemployee).length, 4).number(salestoday.surface).style(regular);
      worksheet.cell(4 + Object.keys(salesbyemployee).length, 5).number(salestoday.tts).style(regular);
      worksheet.cell(4 + Object.keys(salesbyemployee).length, 6).number(salestoday.bp).style(regular);

      // Goals at the end
      worksheet.cell(4 + Object.keys(salesbyemployee).length + 1, 1).string(`Goals`).style(bold);
      worksheet.cell(4 + Object.keys(salesbyemployee).length + 1, 2).number(goals.oem).style(regular);
      worksheet.cell(4 + Object.keys(salesbyemployee).length + 1, 3).number(goals.office).style(regular);
      worksheet.cell(4 + Object.keys(salesbyemployee).length + 1, 4).number(goals.surface).style(regular);
      worksheet.cell(4 + Object.keys(salesbyemployee).length + 1, 5).number(goals.tts).style(regular);
      worksheet.cell(4 + Object.keys(salesbyemployee).length + 1, 6).number(goals.bp).style(regular);
    };

    // Output the report to a buffer
    const buffer = await workbook.writeToBuffer();
    const data = buffer.toString('base64');

    const now = utcToZonedTime(new Date().toISOString(), 'America/Denver');
    const yesterday = subDays(now, 1);

    // Save the data to the database
    await new Report({
      guid: reportid,
      date: new Date(),
      filename: `daily_report_${yesterday.toISOString().split('T')[0]}.xlsx`,
      format: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: data
    }).save();

    // Notify complete
    console.log('  Finished daily report @ ' + new Date().toISOString());

    // Move on to email report
    emailReport(reportid);
  } catch (err) {
    return console.log('There was an error running the daily report:\n' + String(err));
  }
}

// Run the report every day at 12:00PM UTC (at this time all US time zones are on the same 'next' day)
cron.schedule('0 12 * * *', async () => {
  const automatic_reporting_enabled = await Setting.findOne({ name: 'automatic_reporting_enabled' });
  if (!automatic_reporting_enabled.value) return;
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
    const latest = await Report.find().sort({ _id: -1 }).limit(1);
    return res.send(latest.length > 0 ? latest[0] : { error: 'There are no reports' });
  } catch (err) {
    // Send back an error if there is any
    return res.send({ error: String(err) });
  }
});

// Get a specific report
router.post('/getsettings', async (req, res) => {
  try {
    // Authenticate user
    if (!req.session.employeenumber) throw 'Session expired, you are not authenticated';
    if (!req.session.admin) throw 'You must have admin priveleges to view report settings';
    // Build response object from different settings
    const autoenabled = await Setting.findOne({ name: 'automatic_reporting_enabled' });
    const emailenabled = await Setting.findOne({ name: 'report_email_sending_enabled' });
    const emailrecipients = await Setting.findOne({ name: 'report_email_recipients' });
    const response = {
      autoenabled: autoenabled.value,
      emailenabled: emailenabled.value,
      emailrecipients: emailrecipients.value
    }
    // Send back the current settings
    return res.send(response);
  } catch (err) {
    // Send back an error if there is any
    return res.send({ error: String(err) });
  }
});

// Get a specific report
router.post('/setsettings', async (req, res) => {
  try {
    // Authenticate user
    if (!req.session.employeenumber) throw 'Session expired, you are not authenticated';
    if (!req.session.admin) throw 'You must have admin priveleges to view reports';
    // Validate
    if (!req.body.hasOwnProperty('autoenabled') || typeof req.body.autoenabled != 'boolean') throw 'Submitted settings do not conform to type standards';
    if (!req.body.hasOwnProperty('emailenabled') || typeof req.body.emailenabled != 'boolean') throw 'Submitted settings do not conform to type standards';
    if (!req.body.hasOwnProperty('emailrecipients') || !Array.isArray(req.body.emailrecipients)) throw 'Submitted settings do not conform to type standards';
    // Save the settings
    await Setting.findOneAndUpdate({ name: 'automatic_reporting_enabled' }, { value: req.body.autoenabled });
    await Setting.findOneAndUpdate({ name: 'report_email_sending_enabled' }, { value: req.body.emailenabled });
    await Setting.findOneAndUpdate({ name: 'report_email_recipients' }, { value: req.body.emailrecipients });
    // Notify the user
    return res.send({ success: 'The reporting settings have been updated' });
  } catch (err) {
    // Send back an error if there is any
    return res.send({ error: String(err) });
  }
});

// Exporting the router to be used elsewhere
module.exports = router;