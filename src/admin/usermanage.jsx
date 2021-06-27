/**
 * 164 Toolbox / Admin User Managenment
 * 
 * Konstantin Zaremski
 * -- June 27, 2021
 */

// Import dependencies
import React from 'react';
import { Link } from 'react-router-dom';

export default class AdminUserManage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      employeename: '',
      isadmin: false,

      users: []
    }
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
        body: JSON.stringify({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
      data = response;
      if (!data.goals) data.goals = this.state.goals;
    } catch (err) {
      console.log(err);
      data = { error: 'There was an error while automatically updating statistics. Possible errors: 404, 500.' };
    }
    this.setState({ ...data });
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
        {this.state.isadmin ?
          <>

          </>
          : <>
            <div className="alert alert-danger"><strong>Access Denied</strong><br />Your account is not authorized to access this area.<br className="mb-3" /><Link to="/" className="text-danger">Go back to the main menu.</Link></div>
          </>}
      </>
    );
  }
}