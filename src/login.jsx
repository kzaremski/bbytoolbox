/**
 * 164 Toolbox / Login Screen
 * 
 * Konstantin Zaremski
 * -- June 11, 2021
 */

// Import dependencies
import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      pin1: '',
      pin2: '',
      pin3: '',
      pin4: '',
      error: null,
      submitting: false
    }

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  async doLogin(employeenumber, pinnumber) {
    try {
      const data = await fetch('/login', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        body: JSON.stringify({
          employeenumber: employeenumber,
          pinnumber: pinnumber
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          window.employeenumber = data.name;
          window.employeename = data.number;
        }
        if (data.error) throw data.error;
        return data;
      });
      return data;
    } catch(err) {
      return { error: String(err) };
    }
  }

  login() {
    if (this.state.submitting) return;
    this.setState({ submitting: true, error: null }, () => {
      this.doLogin(this.state.employeenumber, this.state.pin1 + this.state.pin2 + this.state.pin3 + this.state.pin4).then((data) => {
        if (data.error) this.setState({ pin1: '', pin2: '', pin3: '', pin4: ''});
        this.setState({ ...data, submitting: false });
        window.checkLoginStatus();
      });
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    // Do nothing for pin number
    const pins = ['pin1', 'pin2', 'pin3', 'pin4'];
    if (pins.includes(target.name)) return;

    const corrected = value.replace(/\D/g, '');

    this.setState({
      [name]: event.target.name === 'employeenumber' ? corrected : value
    });
  }

  handleKeyDown(event) {
    if (event.target.name === 'employeenumber' && event.key === 'Enter' && !(this.state.employeenumber.length < 1 || this.state.submitting)) {
      event.preventDefault();
      if (this.state.pin1 != '' || this.state.pin2 != '' || this.state.pin3 != '' || this.state.pin4 != '') this.login();
      else document.getElementById('pin1').focus();
    }
    const pins = ['pin1', 'pin2', 'pin3', 'pin4'];
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    // Cycle through the PIN digits
    if (pins.includes(event.target.name)) {
      event.preventDefault();
      const currentPin = event.target.name;
      if (numbers.includes(event.key)) {
        this.setState({ [currentPin]: event.key }, () => {
          // Cycle through the PIN digits
          if (pins.indexOf(currentPin) < 3) document.getElementById(pins[pins.indexOf(currentPin) + 1]).focus();
          if (pins.indexOf(currentPin) === 3) {
            if (this.state.pin1 != '' && this.state.pin2 != '' && this.state.pin3 != '' && this.state.pin4 != '' && !(this.state.employeenumber.length < 1 || this.state.submitting)) this.login();
            document.activeElement.blur();
          }
        });
      }
    }
  }

  render() {
    return (
      <>
        <Redirect to='/'/>
        <div className="d-flex flex-direction-row">
          <div className="col-md-8 col-lg-6 p-0 mx-auto">
            <div className="card bg-light mb-3">
              <h5 className="card-header">Login</h5>
              <div className="card-body">
                { this.state.submitting ? <div className="alert alert-warning">Logging in, please wait...</div> : null}
                { this.state.error ? <div className="alert alert-danger"><strong>Error: </strong>{this.state.error}</div> : null}
                <p className="card-text">Changes made are tracked and associated by employee number. Please enter your Best Buy&reg; employee number and PIN number to continue.</p>
                <div className="form-group mb-0">
                  <input type="number" autoComplete="off" className="form-control mb-2" id="employeenumberinput" placeholder="Your employee number" step="1" onKeyDown={this.handleKeyDown} value={this.state.employeenumber} onChange={this.handleChange} name="employeenumber"/>
                  <div className="row">
                    <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="pin1" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.pin1} name="pin1"/></div>
                    <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="pin2" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.pin2} name="pin2"/></div>
                    <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="pin3" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.pin3} name="pin3"/></div>
                    <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="pin4" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.pin4} name="pin4"/></div>
                  </div>
                  <div className="d-flex flex-direction-row mt-2" >
                    <button type="button" className="ml-auto btn btn-primary" onClick={this.login} disabled={this.state.employeenumber.length < 1 || this.state.submitting}>Log in</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-muted text-center">This is not an official Best Buy&reg; application. Use at your discretion.</p>
          <p className="text-muted text-center">Copyright &copy; 2021 Konstantin Zaremski &mdash; Licensed under the MIT license.</p>
        </div>
      </>
    );
  }
}