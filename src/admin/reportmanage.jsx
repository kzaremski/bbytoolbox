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

      autoreportenabled: false,
      emailsendenabled: false,
      reportrecipients: []
    };

    // Bind this to component methods

    this.addRecipient = this.addRecipient.bind(this);
    this.delRecipient = this.delRecipient.bind(this);

    this.toggleOption = this.toggleOption.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    
  }

  // Add a recipient to the list of recipients
  addRecipient() {
    this.setState({ error: null, status: null }, () => {
      const email = this.state.email.replace(' ', '').trim();
      if (email.split('@').length != 2
        || email.split('@')[0].length < 1
        || email.split('@')[1].split('.').length != 2) return this.setState({ error: 'The email that you have entered is invalid' });
      if (this.state.reportrecipients.indexOf(email) >= 0) return this.setState({ error: 'That email is already in the list', email: '' });
      let recipients = this.state.reportrecipients.slice();
      recipients.push(email);
      this.setState({ reportrecipients: recipients, email: '' });
    });
  }

  // Remove an email from the list
  delRecipient(event) {
    const email = event.currentTarget.name;
    let recipients = this.state.reportrecipients.slice();
    const index = recipients.indexOf(email);
    if (index > -1) recipients.splice(index, 1);
    this.setState({ reportrecipients: recipients, status: `Removed "${email}" from the list` });
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
          <Button variant="danger" className="ml-auto mr-3" onClick={this.getReportSettings}><FontAwesomeIcon icon={faTrash} className="mr-2" />Discard Changes</Button>
          <Button variant="success" onClick={this.saveReportSettings}><FontAwesomeIcon icon={faSave} className="mr-2" />Save</Button>
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
              <Button variant={!this.state.autoreportenabled ? "danger" : "dark"} className="w-50 text-center" name="autoreportenabled" onClick={this.toggleOption} disabled={this.state.loading}><strong>No</strong></Button>
              <Button variant={this.state.autoreportenabled ? "success" : "dark"} className="w-50 text-center" name="autoreportenabled" onClick={this.toggleOption} disabled={this.state.loading}><strong>Yes</strong></Button>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="content" className="col-sm-4 mt-1">Enable email notifications?</label>
          <div className="col-sm-8 d-flex">
            <div className="flex-grow-0 d-flex flex-direction-row">
              <Button variant={!this.state.emailsendenabled ? "danger" : "dark"} className="w-50 text-center" name="emailsendenabled" onClick={this.toggleOption} disabled={this.state.loading}><strong>No</strong></Button>
              <Button variant={this.state.emailsendenabled ? "success" : "dark"} className="w-50 text-center" name="emailsendenabled" onClick={this.toggleOption} disabled={this.state.loading}><strong>Yes</strong></Button>
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
        {this.state.reportrecipients.length > 0 ?
          this.state.reportrecipients.map((email) =>
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