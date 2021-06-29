/**
 * 164 Toolbox / User Settings
 * 
 * Konstantin Zaremski
 * -- June 27, 2021
 */

// Import dependencies
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default class UserSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      employeename: '',
      isadmin: false,

      // PIN digits
      old_pin1: '',
      old_pin2: '',
      old_pin3: '',
      old_pin4: '',
      new_pin1: '',
      new_pin2: '',
      new_pin3: '',
      new_pin4: '',

      pinchange: false
    }

    // Bind this to component functions
    this.openChangePIN = this.openChangePIN.bind(this);
    this.closeChangePIN = this.closeChangePIN.bind(this);

    this.changePIN = this.changePIN.bind(this);

    // Event handlers
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename,
      isadmin: window.isadmin
    });
  }

  // Open and close the PIN change window
  openChangePIN() { this.setState({ pinchange: true }) }
  closeChangePIN() { this.setState({ pinchange: false }) }

  async changePIN() {
    this.setState({ saving: true }, async () => {
      let data = {};
      try {
        // Load data
        let response = await fetch('/user/changepin', {
          method: 'POST',
          mode: 'same-origin',
          cache: 'no-cache',
          credentials: 'same-origin',
          body: JSON.stringify({
            oldpin: this.state.old_pin1 + this.state.old_pin2 + this.state.old_pin3 + this.state.old_pin4,
            newpin: this.state.new_pin1 + this.state.new_pin2 + this.state.new_pin3 + this.state.new_pin4
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json());
        data = response;
      } catch (err) {
        console.log(err);
        if (response) console.log(response);
        data = { error: 'There was an error parsing the response from the backend. Possible errors: 404, 500.' };
      }

      this.setState({
        ...data,
        saving: false,
        old_pin1: '',
        old_pin2: '',
        old_pin3: '',
        old_pin4: '',
        new_pin1: '',
        new_pin2: '',
        new_pin3: '',
        new_pin4: ''
      });
      
      if (!data.error) this.setState({ pinchange: false });
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // Do nothing for pin number
    const pins = [
      'old_pin1',
      'old_pin2',
      'old_pin3',
      'old_pin4',
      'new_pin1',
      'new_pin2',
      'new_pin3',
      'new_pin4'
    ];
    if (pins.includes(target.name)) return;

    const corrected = value.replace(/\D/g, '');

    this.setState({
      [name]: event.target.name === 'employeenumber' ? corrected : value
    });
  }

  // Handle individual keypresses
  handleKeyDown(event) {
    const pins = [
      'old_pin1',
      'old_pin2',
      'old_pin3',
      'old_pin4',
      'new_pin1',
      'new_pin2',
      'new_pin3',
      'new_pin4'
    ];
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    // Cycle through the PIN digits
    if (pins.includes(event.target.name)) {
      event.preventDefault();
      const currentPin = event.target.name;
      if (numbers.includes(event.key)) {
        this.setState({ [currentPin]: event.key }, () => {
          // Cycle through the PIN digits
          if (pins.indexOf(currentPin) < pins.length - 1) document.getElementById(pins[pins.indexOf(currentPin) + 1]).focus();
          else document.activeElement.blur();
        });
      }
    }
  }

  render() {
    return (
      <>
        <h3>User Settings</h3>
        {this.state.success ? <Alert variant="success" onClose={() => { this.setState({ success: null }) }} dismissible>{this.state.success}</Alert> : null}
        <div className="table-responsive">
          <table className="table">
            <tbody>
              <tr>
                <th>Employee Name</th>
                <td>{this.state.employeename}</td>
              </tr>
              <tr>
                <th>Employee Number</th>
                <td>{this.state.employeenumber}</td>
              </tr>
              <tr>
                <th>Access Level</th>
                <td>{this.state.isadmin ? 'Administrator' : 'User'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="btn btn-primary px-3" onClick={this.openChangePIN}>Change PIN</button>

        <Modal show={this.state.saving} size="sm" onHide={() => { return }}>
          <Modal.Body className="bg-warning">
            <div className="d-flex flex-direction-column align-items-center justify-content-middle">
              <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
            <h5 className="text-center text-white mb-0 mt-3 d-block">Saving Changes</h5>
          </Modal.Body>
        </Modal>

        <Modal show={this.state.pinchange && !this.state.saving} onHide={this.closeChangePIN}>
          <Modal.Header closeButton>
            <Modal.Title>Change PIN</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.error ? <Alert variant="danger" onClose={() => { this.setState({ error: null }) }} dismissible>{this.state.error}</Alert> : null}
            <p>
              Change the PIN number that you use to log in to the application.
            </p>
            <label>Old PIN</label>
            <div className="row mb-3">
              <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="old_pin1" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.old_pin1} name="old_pin1" /></div>
              <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="old_pin2" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.old_pin2} name="old_pin2" /></div>
              <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="old_pin3" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.old_pin3} name="old_pin3" /></div>
              <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="old_pin4" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.old_pin4} name="old_pin4" /></div>
            </div>
            <label>New PIN</label>
            <div className="row">
              <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="new_pin1" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.new_pin1} name="new_pin1" /></div>
              <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="new_pin2" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.new_pin2} name="new_pin2" /></div>
              <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="new_pin3" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.new_pin3} name="new_pin3" /></div>
              <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="new_pin4" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.new_pin4} name="new_pin4" /></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeChangePIN}>Cancel</Button>
            <Button variant="primary" onClick={this.changePIN} disabled={
              this.state.old_pin1 == '' || this.state.old_pin2 == '' || this.state.old_pin3 == '' || this.state.old_pin4 == '' ||
              this.state.new_pin1 == '' || this.state.new_pin2 == '' || this.state.new_pin3 == '' || this.state.new_pin4 == ''}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}