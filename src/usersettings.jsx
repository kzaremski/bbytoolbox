/**
 * 164 Toolbox / User Settings
 * 
 * Konstantin Zaremski
 * -- June 27, 2021
 */

// Import dependencies
import React from 'react';

export default class UserSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      employeename: '',
      isadmin: false
    }
  }

  componentDidMount() {
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename,
      isadmin: window.isadmin
    });
  }

  render() {
    return (
      <>
        <h3>User Settings</h3>
        <div className="table-responsive">
          <table className="table">
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
          </table>
        </div>
        <button className="btn btn-primary px-3">Change PIN</button>
      </>
    );
  }
}