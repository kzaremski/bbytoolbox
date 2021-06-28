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

      selected: null,
      users: []
    }

    // Bind this to component methods
    this.selectUser = this.selectUser.bind(this);
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

  // Select a user
  selectUser(event) {
    const clicked = event.currentTarget.getAttribute('name');
    this.setState({ selected: clicked });
  }

  render() {
    // Get the object of the selected user
    const selectedUser = this.state.users.find(user => {
      return user.number === this.state.selected;
    });

    const selected = this.state.selected ? (
      <div className="bg-light p-3 my-3" key={selectedUser.number}>
        <h5 className="mb-1">{selectedUser.name}</h5>
        <div className="row mb-2">
          <div className="col-md-4">Employee: {selectedUser.number}</div>
          <div className="col-md-4">Admin: {selectedUser.admin ? 'YES' : 'NO'}</div>
          <div className="col-md-4">Disabled: {selectedUser.disabled ? 'YES' : 'NO'}</div>
        </div>
        <button className="btn btn-primary">Reset PIN</button>
      </div>
    ) : null;

    return (
      <>
        {this.state.isadmin ?
          <>
            <h6><strong>EMPLOYEE USER ACCOUNTS:</strong></h6>
            {this.state.users.length == 0 ? <p>No employee user accounts found.</p> :
              this.state.users.map((user) => (
                user.number === this.state.selected ? selected :
                  <div className="mb-2" style={{ "cursor": "pointer" }} onClick={this.selectUser} name={user.number} key={user.number}>
                    <h5 className="mb-1">{user.name}</h5>
                    <div className="row">
                      <div className="col-md-4">Employee: {user.number}</div>
                      <div className="col-md-4">Admin: {user.admin ? 'YES' : 'NO'}</div>
                      <div className="col-md-4">Disabled: {user.disabled ? 'YES' : 'NO'}</div>
                    </div>
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