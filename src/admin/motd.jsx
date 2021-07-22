/**
 * BBY Toolbox
 * -- Admin MOTD Settings
 * -- Konstantin Zaremski
 * -- July 20, 2021
 */

// Import dependencies
import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

// Font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

export default class AdminMOTDManage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      saving: false,
      success: null,
      error: null,

      content: '',
      type: 'primary',
      enabled: false
    };

    // Bind this to component methods
    this.getMOTD = this.getMOTD.bind(this);
    this.saveMOTD = this.saveMOTD.bind(this);
    this.toggleOption = this.toggleOption.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getMOTD() {
    this.setState({ loading: true }, async () => {
      let data = {};

      try {
        // Load data
        let response = await fetch('/motd/get', {
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

  saveMOTD() {
    this.setState({ saving: true }, async () => {
      let data = {};
      try {
        // Load data
        let response = await fetch('/motd/set', {
          method: 'POST',
          mode: 'same-origin',
          cache: 'no-cache',
          credentials: 'same-origin',
          body: JSON.stringify({
            enabled: this.state.enabled,
            content: this.state.content,
            type: this.state.type
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
    this.getMOTD();
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

    if (name === 'content' && this.state.content.length >= 240 && value.length >= this.state.content.length) return;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Toolbox</Link></li>
          <li className="breadcrumb-item"><Link to="/admin">System Admin</Link></li>
          <li className="breadcrumb-item active">Message of the Day</li>
        </ol>
        <div className="d-flex flex-direction-row align-items-start mb-2">
          <h5 className="mt-1"><strong>MESSAGE OF THE DAY</strong></h5>
          <Button variant="danger" className="ml-auto mr-3" onClick={this.getMOTD}><FontAwesomeIcon icon={faTrash} className="mr-2" />Discard Changes</Button>
          <Button variant="success" onClick={this.openNewStore} onClick={this.saveMOTD}><FontAwesomeIcon icon={faSave} className="mr-2" />Save</Button>
        </div>

        {this.state.loading ? <Alert variant="warning">Loading the current settings</Alert> : null}
        {this.state.saving ? <Alert variant="warning">Updating the MOTD</Alert> : null}
        {this.state.success ? <Alert variant="success" onClose={() => { this.setState({ success: null }) }} dismissible>{this.state.success}</Alert> : null}
        {this.state.error ? <Alert variant="danger" onClose={() => { this.setState({ error: null }) }} dismissible>{this.state.error}</Alert> : null}

        <p>The message of the day or MOTD is a short alert displayed above the applications listed on the home screen. It can be used for things like acknowledging problems or making announcements. Employees of all stores will be able to see this alert.</p>
        <div className="form-group row">
          <label htmlFor="content" className="col-2 mt-1">Display MOTD?</label>
          <div className="col-10 d-flex">
            <div className="flex-grow-0 d-flex flex-direction-row">
              <Button variant={!this.state.enabled ? "danger" : "dark"} className="w-50 text-center" name="enabled" onClick={this.toggleOption} disabled={this.state.loading}><strong>No</strong></Button>
              <Button variant={this.state.enabled ? "success" : "dark"} className="w-50 text-center" name="enabled" onClick={this.toggleOption} disabled={this.state.loading}><strong>Yes</strong></Button>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="type" className="col-sm-2 col-form-label">Type</label>
          <div className="col-sm-10">
            <select className='form-control' name="type" value={this.state.type} onChange={this.handleChange} disabled={this.state.loading}>
              <option value='primary'>Primary (blue)</option>
              <option value='secondary'>Secondary (dark)</option>
              <option value='success'>Success (green)</option>
              <option value='info'>Info (purple)</option>
              <option value='warning'>Warning (orange)</option>
              <option value='danger'>Danger (red)</option>
            </select>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="content" className="col-sm-2">Content</label>
          <div className="col-sm-10">
            <textarea onChange={this.handleChange} className="form-control" value={this.state.content} name="content" placeholder="Text to display within the alert..." rows="5" disabled={this.state.loading}></textarea>
            <p className="small text-right">{240 - this.state.content.length} char(s) remaining.</p>
          </div>
        </div>
        <h5>Preview</h5>
        {this.state.content.length > 0 ? <Alert variant={this.state.type}>{this.state.content}</Alert> : <p className="small pl-3">The content is empty. Enter a message to see a preview of the alert.</p>}
      </>
    );
  }
}