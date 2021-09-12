/**
 * 164 Toolbox / Login Screen
 * 
 * Konstantin Zaremski
 * -- June 11, 2021
 */

// Import dependencies
import React from 'react';
import { Redirect } from 'react-router-dom';
import PINinput from './components/pininput.jsx';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      login: '',
      error: null,
      pinauth: false,
      loadingsettings: true,
      submitting: false
    }

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.pinEnd = this.pinEnd.bind(this);
  }

  async loadSetings() {
    try {
      const data = await fetch('/systemsettings', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json());
      return data;
    } catch(err) {
      return { error: String(err) };
    }
  }

  componentDidMount() {
    this.loadSetings().then((data) => { this.setState({ ...data, loadingsettings: false }) });
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
          window.store = data.store;
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
      this.doLogin(this.state.employeenumber, this.state.login).then((data) => {
        if (data.error) this.setState({ login: '' });
        this.setState({ ...data, submitting: false });
        window.checkLoginStatus();
      });
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    const corrected = value.replace(/\D/g, '');

    this.setState({
      [name]: event.target.name === 'employeenumber' ? corrected : value
    });
  }

  handleKeyDown(event) {
    if (event.target.name === 'employeenumber' && event.key === 'Enter' && !(this.state.employeenumber.length < 1 || this.state.submitting)) {
      event.preventDefault();
      if (!this.state.pinauth || this.login.trim().length > 1) this.login();
      else document.getElementById('login_pin1').focus();
    }
  }

  pinEnd() {
    if (this.state.login.trim().length > 0 && !(this.state.employeenumber.length < 1 || this.state.submitting)) this.login();
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
                { this.state.loadingsettings ? <div className="alert alert-warning">Loading system settings...</div> : null}
                { this.state.submitting ? <div className="alert alert-warning">Logging in, please wait...</div> : null}
                { this.state.error ? <div className="alert alert-danger"><strong>Error: </strong>{this.state.error}</div> : null}
                <p className="card-text">Changes made are tracked and associated by employee number. Please enter your Best Buy&reg; employee number and PIN number to continue.</p>
                { this.state.pinauth ? <div className="form-group mb-0">
                  <input type="number" autoComplete="off" className="form-control mb-2" id="employeenumberinput" placeholder="Your employee number" step="1" onKeyDown={this.handleKeyDown} value={this.state.employeenumber} onChange={this.handleChange} name="employeenumber"/>
                  <PINinput name="login" value={this.state.login} onChange={this.handleChange} onEnd={this.pinEnd}/>
                  <div className="d-flex flex-direction-row mt-2" >
                    <button type="button" className="ml-auto btn btn-primary" onClick={this.login} disabled={this.state.employeenumber.length < 1 || this.state.submitting || this.state.loadingsettings || this.state.login.trim().length < 4}>Log in</button>
                  </div>
                </div> : <div className="form-group mb-0">
                  <input type="number" autoComplete="off" className="form-control mb-2" id="employeenumberinput" placeholder="Your employee number" step="1" onKeyDown={this.handleKeyDown} value={this.state.employeenumber} onChange={this.handleChange} name="employeenumber"/>
                  <div className="d-flex flex-direction-row mt-2" >
                    <button type="button" className="ml-auto btn btn-primary" onClick={this.login} disabled={this.state.employeenumber.length < 1 || this.state.submitting || this.state.loadingsettings}>Log in</button>
                  </div>
                </div> }
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