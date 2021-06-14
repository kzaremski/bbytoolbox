/**
 * 164 Toolbox / Home Screen
 * 
 * Konstantin Zaremski
 * -- June 14, 2021
 */

// Import dependencies
import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      employeename: '',
    }
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

  componentDidMount() {
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename
    });
  }

  render() {
    const FirstNameL = this.state.employeename.split(' ').length > 1 ?
                       this.state.employeename.split(' ')[0] + ' ' + this.state.employeename.split(' ')[1].substring(0, 1) :
                       this.state.employeename;

    return (
      <div className="d-flex flex-direction-row">
        <div className="mt-2">Welcome, <strong>{FirstNameL}</strong>.</div>
        <div className="ml-auto"><button className="btn btn-danger" onClick={this.logout}>Logout</button></div>
      </div>
    );
  }
}