/**
 * BBY Toolbox
 * -- Admin Report Settings
 * -- Konstantin Zaremski
 * -- July 23, 2021
 */

// Import dependencies
import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

// Font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

export default class AdminReportManage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      saving: false,
      success: null,
      status: null,
      error: null,

      email: '',

      autoenabled: false,
      emailenabled: false,
      emailrecipients: []
    };

    // Bind this to component methods
    this.getSettings = this.getSettings.bind(this);
    this.setSettings = this.setSettings.bind(this);

    this.addRecipient = this.addRecipient.bind(this);
    this.delRecipient = this.delRecipient.bind(this);

    this.toggleOption = this.toggleOption.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  getSettings() {
    this.setState({ loading: true, error: null }, async () => {
      let data = {};

      try {
        // Load data
        let response = await fetch('/report/getsettings', {
          method: 'POST',
          mode: 'same-origin',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json());
        data = response;
      } catch (err) {
        console.log(err);
        data = { error: 'There was an error parsing the response from the backend. Possible errors: 404, 500.' };
      }

      this.setState({
        ...data,
        success: null,
        loading: false
      });
    });
  }

  setSettings() {
    this.setState({ saving: true, error: null, success: null }, async () => {
      let data = {};
      try {
        // Load data
        let response = await fetch('/report/setsettings', {
          method: 'POST',
          mode: 'same-origin',
          cache: 'no-cache',
          credentials: 'same-origin',
          body: JSON.stringify({
            autoenabled: this.state.autoenabled,
            emailenabled: this.state.emailenabled,
            emailrecipients: this.state.emailrecipients
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json());
        data = response;
      } catch (err) {
        console.log(err);
        data = { error: 'There was an error parsing the response from the backend. Possible errors: 404, 500.' };
      }

      this.setState({
        ...data,
        saving: false
      });
    });
  }

  componentDidMount() {
    this.getSettings();
  }

  // Add a recipient to the list of recipients
  addRecipient() {
    this.setState({ error: null, status: null }, () => {
      const email = this.state.email.replace(' ', '').trim();
      if (email.split('@').length != 2
        || email.split('@')[0].length < 1
        || email.split('@')[1].split('.').length != 2) return this.setState({ error: 'The email that you have entered is invalid' });
      if (this.state.emailrecipients.indexOf(email) >= 0) return this.setState({ error: 'That email is already in the list', email: '' });
      let recipients = this.state.emailrecipients.slice();
      recipients.push(email);
      this.setState({ emailrecipients: recipients, email: '' });
    });
  }

  // Remove an email from the list
  delRecipient(event) {
    const email = event.currentTarget.name;
    let recipients = this.state.emailrecipients.slice();
    const index = recipients.indexOf(email);
    if (index > -1) recipients.splice(index, 1);
    this.setState({ emailrecipients: recipients, status: `Removed "${email}" from the list` });
  }

  // Toggle an option
  toggleOption(event) {
    const option = event.currentTarget.name;
    this.setState({
      [option]: this.state[option] ? false : true
    });
  }

  // Handle input changes
  handleChange(event) {
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name == 'email') value = value.replace(' ', '');

    this.setState({
      [name]: value
    });
  }

  handleKeyDown(event) {
    if (event.target.name === 'email' && event.key === 'Enter' && !(this.state.email.length < 1 || this.state.saving || this.state.loading)) {
      event.preventDefault();
      this.addRecipient();
    }
  }

  render() {
    return (
      <>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Toolbox</Link></li>
          <li className="breadcrumb-item"><Link to="/admin">System Admin</Link></li>
          <li className="breadcrumb-item active">Reporting</li>
        </ol>
        <div className="d-flex flex-direction-row align-items-start mb-2">
          <h5 className="mt-1"><strong>Reporting</strong></h5>
          <Button variant="danger" className="ml-auto mr-3" onClick={this.getSettings}><FontAwesomeIcon icon={faTrash} className="mr-2" />Discard Changes</Button>
          <Button variant="success" onClick={this.setSettings}><FontAwesomeIcon icon={faSave} className="mr-2" />Save</Button>
        </div>

        {this.state.loading ? <Alert variant="warning">Loading the current settings</Alert> : null}
        {this.state.saving ? <Alert variant="warning">Updating the report settings</Alert> : null}
        {this.state.status ? <Alert variant="primary" onClose={() => { this.setState({ status: null }) }} dismissible>{this.state.status}</Alert> : null}
        {this.state.success ? <Alert variant="success" onClose={() => { this.setState({ success: null }) }} dismissible>{this.state.success}</Alert> : null}
        {this.state.error ? <Alert variant="danger" onClose={() => { this.setState({ error: null }) }} dismissible>{this.state.error}</Alert> : null}

        <div className="form-group row">
          <label htmlFor="content" className="col-sm-4 mt-1">Enable automatic reporting?</label>
          <div className="col-sm-8 d-flex">
            <div className="flex-grow-0 d-flex flex-direction-row">
              <Button variant={!this.state.autoenabled ? "danger" : "dark"} className="w-50 text-center" name="autoenabled" onClick={this.toggleOption} disabled={this.state.loading}><strong>No</strong></Button>
              <Button variant={this.state.autoenabled ? "success" : "dark"} className="w-50 text-center" name="autoenabled" onClick={this.toggleOption} disabled={this.state.loading}><strong>Yes</strong></Button>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="content" className="col-sm-4 mt-1">Enable email notifications?</label>
          <div className="col-sm-8 d-flex">
            <div className="flex-grow-0 d-flex flex-direction-row">
              <Button variant={!this.state.emailenabled ? "danger" : "dark"} className="w-50 text-center" name="emailenabled" onClick={this.toggleOption} disabled={this.state.loading}><strong>No</strong></Button>
              <Button variant={this.state.emailenabled ? "success" : "dark"} className="w-50 text-center" name="emailenabled" onClick={this.toggleOption} disabled={this.state.loading}><strong>Yes</strong></Button>
            </div>
          </div>
        </div>
        <p className="mb-1">Email Report Recipients</p>
        <div className="d-flex flex-direction-row mb-3">
          <div className="mr-3 flex-grow-1">
            <input className="form-control" type="text" name="email" placeholder="john@example" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.email} />
          </div>
          <Button variant="primary" disabled={this.state.email.length === 0} onClick={this.addRecipient}><FontAwesomeIcon icon={faPlus} /></Button>
        </div>
        {this.state.emailrecipients.length > 0 ?
          this.state.emailrecipients.map((email) =>
            <div className="d-flex flex-direction-row mb-3" key={email}>
              <div className="mr-3 flex-grow-1">
                <label className="mt-1">{email}</label>
              </div>
              <Button variant="danger" onClick={this.delRecipient} name={email}><FontAwesomeIcon icon={faTimes} /></Button>
            </div>
          )
        : <p className="ml-5 small">No email addresses are set to receive the daily reports.</p>}
      </>
    );
  }
}