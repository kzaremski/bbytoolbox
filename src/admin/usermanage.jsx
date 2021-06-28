/**
 * 164 Toolbox / Admin User Managenment
 * 
 * Konstantin Zaremski
 * -- June 27, 2021
 */

// Import dependencies
import React from 'react';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

export default class AdminUserManage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      employeename: '',
      isadmin: false,

      users: []
    }

    // Bind this to component methods
    this.getAllUsers = this.getAllUsers.bind(this);
  }

  async getAllUsers() {
    let data = {};
    try {
      // Load data
      let response = await fetch('/admin/getusers', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
      data = response;
      console.log(data)
    } catch (err) {
      console.log(err);
      data = { error: 'There was an error while loading the list of employees.' };
    }
    this.setState({ ...data });
  }

  componentDidMount() {
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename,
      isadmin: window.isadmin
    });
    this.getAllUsers();
  }

  render() {
    return (
      <>
        {this.state.isadmin ?
          <>
            <h6><strong>EMPLOYEE USER ACCOUNTS:</strong></h6>
            { this.state.users.length == 0 ? <p>No employee user accounts found.</p> : 
              this.state.users.map((user) => (
                <div>
                  <h5>{ user.name }</h5>
                </div>
              ))
            }            
          </>
          : <>
            <div className="alert alert-danger"><strong>Access Denied</strong><br />Your account is not authorized to access this area.<br className="mb-3" /><Link to="/" className="text-danger">Go back to the main menu.</Link></div>
          </>}
      </>
    );
  }
}