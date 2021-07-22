/**
 * BBY Toolbox / Home Screen
 * 
 * Konstantin Zaremski
 * -- June 14, 2021
 */

// Import dependencies
import React from 'react';
import { Link } from 'react-router-dom';

import Alert from 'react-bootstrap/Alert';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      employeename: '',
      isadmin: false,
      motd: null
    }

    this.getMOTD = this.getMOTD.bind(this);
  }

  async logout() {
    const logout = await fetch('/logout', {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
    if (logout.success) window.checkLoginStatus();
  }

  async getMOTD() {
    let data = {};

    try {
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

    if (data.error) return this.setState({ ...data });
    this.setState({ motd: data });
  }

  componentDidMount() {
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename,
      isadmin: window.isadmin
    });
    this.getMOTD();
  }

  render() {
    const FirstNameL = this.state.employeename.split(' ').length > 1 ?
      this.state.employeename.split(' ')[0] + ' ' + this.state.employeename.split(' ')[1].substring(0, 1) :
      this.state.employeename;

    return (
      <>
        <div className="d-flex flex-direction-row mb-3">
          <div className="mt-2">Welcome, <strong>{FirstNameL}</strong>.</div>
          <div className="ml-auto"><button className="btn btn-danger" onClick={this.logout}>Logout</button></div>
        </div>
        {(this.state.motd && this.state.motd.enabled) ? <Alert variant={this.state.motd.type}>{this.state.motd.content}</Alert> : null }
        <Link to="/saletracker">
          <div className="d-flex border p-3 mb-3">
            <div>
              <img src="/static/img/bar-chart.svg" style={{ "width": "100px" }} />
            </div>
            <div className="pl-3 text-dark">
              <h5>Computing Sale Unit Tracker</h5>
              <p className="m-0">Track services, memberships, and device sales in the computing department.</p>
            </div>
          </div>
        </Link>
        {this.state.isadmin ? <>
          <div className="row">
            <div className="col-6">
              <Link to="/admin">
                <div className="d-flex flex-column flex-md-row  border p-3">
                  <div className="d-flex mb-2 mb-md-0">
                    <img src="/static/img/cogs.svg" style={{ "width": "100px" }} className="mx-auto" />
                  </div>
                  <div className="pl-md-3 text-dark text-center text-md-left">
                    <h5>System Admin</h5>
                    <p className="m-0 d-none d-md-block">Manage system settings. <span className="text-warning">Requires admin privileges.</span></p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-6">
              <Link to="/user">
                <div className="d-flex flex-column flex-md-row border p-3">
                  <div className="d-flex mb-2 mb-md-0">
                    <img src="/static/img/user.svg" style={{ "width": "100px" }} className="mx-auto" />
                  </div>
                  <div className="pl-md-3 text-dark text-center text-md-left">
                    <h5>User Settings</h5>
                    <p className="m-0 d-none d-md-block">Change your PIN number and other settings.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </> : <Link to="/user">
          <div className="d-flex border p-3 mb-3">
            <div>
              <img src="/static/img/user.svg" style={{ "width": "100px" }} />
            </div>
            <div className="pl-3 text-dark">
              <h5>User Settings</h5>
              <p className="m-0">Change your PIN number and other settings.</p>
            </div>
          </div>
        </Link>}
      </>
    );
  }
}