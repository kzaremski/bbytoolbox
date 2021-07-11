/**
 * 164 Toolbox / Admin User Managenment
 * 
 * Konstantin Zaremski
 * -- June 27, 2021
 */

// Import dependencies
import React from 'react';
import { Link } from 'react-router-dom';

// Font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// React bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default class AdminUserManage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      employeename: '',
      isadmin: false,

      search: '',
      selected: null,
      users: [],

      pinreset: false,
      pin1: '',
      pin2: '',
      pin3: '',
      pin4: '',

      saving: false
    }

    // Bind this to component methods
    this.selectUser = this.selectUser.bind(this);
    this.deselectUser = this.deselectUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);

    this.openResetPIN = this.openResetPIN.bind(this);
    this.closeResetPIN = this.closeResetPIN.bind(this);
    this.resetPIN = this.resetPIN.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.clearSearch = this.clearSearch.bind(this);
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
    this.setState({
      selected: clicked,
      success: null,
      error: null
    });
  }

  // Deselect the current'y selected user
  deselectUser() {
    this.setState({
      selected: null,
      success: null,
      error: null
    })
  }

  // Open the PIN reset GUI
  openResetPIN() {
    this.setState({
      pinreset: true,
      pin1: '',
      pin2: '',
      pin3: '',
      pin4: ''
    });
  }

  closeResetPIN() {
    this.setState({ pinreset: false });
  }

  // Handle input changes
  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // Do nothing for pin number
    const pins = ['pin1', 'pin2', 'pin3', 'pin4'];
    if (pins.includes(target.name)) return;

    this.setState({
      [name]: value
    });
  }

  // Handle individual keypresses
  handleKeyDown(event) {
    const pins = ['pin1', 'pin2', 'pin3', 'pin4'];
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

  // Submit the PIN reset request
  async resetPIN() {
    this.setState({ saving: true }, async () => {
      let data = {};
      try {
        // Load data
        let response = await fetch('/admin/setpin', {
          method: 'POST',
          mode: 'same-origin',
          cache: 'no-cache',
          credentials: 'same-origin',
          body: JSON.stringify({
            employeenumber: this.state.selected,
            pin: this.state.pin1 + this.state.pin2 + this.state.pin3 + this.state.pin4
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
        saving: false
      });

      if (!data.error) this.closeResetPIN();
    });
  }

  // Clear the search (button)
  clearSearch() { this.setState({ search: '' }) }

  render() {
    // Filter down the search results:
    let searchresults = this.state.users.filter((user) => {
      const searchterm = this.state.search.toLowerCase().replace(/\s+/g, ' ').trim();
      const tosearch = user.name.toLowerCase() + ' ' + user.number;
      return tosearch.includes(searchterm);
    });

    // Get the object of the selected user
    const selectedUser = this.state.users.find(user => {
      return user.number === this.state.selected;
    });

    const selected = this.state.selected ? (
      <div className="bg-light p-3 my-3" key={selectedUser.number}>
        <h5 className="mb-1">{selectedUser.name}</h5>
        {this.state.error ? <Alert variant="danger" onClose={() => { this.setState({ error: null }) }} dismissible>{this.state.error}</Alert> : null}
        <div className="row mb-2">
          <div className="col-md-4">Employee: {selectedUser.number}</div>
          <div className="col-md-4">Admin: {selectedUser.admin ? 'YES' : 'NO'}</div>
          <div className="col-md-4">Disabled: {selectedUser.disabled ? 'YES' : 'NO'}</div>
        </div>
        <button className="btn btn-primary mr-2" onClick={this.openResetPIN}>Reset PIN</button>
        <button className="btn btn-secondary" onClick={this.deselectUser}>Cancel</button>
      </div>
    ) : null;

    return (
      <>
        {
          this.state.isadmin ?
            <>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Toolbox</Link></li>
                <li className="breadcrumb-item"><Link to="/admin">System Admin</Link></li>
                <li className="breadcrumb-item active">User Management</li>
              </ol>
              <h5><strong>USER MANAGEMENT</strong></h5>
              <div className="d-flex flex-direction-row mb-3">
                <div className="mr-3 flex-grow-1">
                  <input className="form-control" type="text" name="search" placeholder="Search by name or number" onChange={this.handleChange} value={this.state.search}/>
                </div>
                <Button variant="danger" disabled={this.state.search.length === 0} onClick={this.clearSearch}><FontAwesomeIcon icon={faTimes}/></Button>
              </div>
              {this.state.success ? <Alert variant="success" onClose={() => { this.setState({ success: null }) }} dismissible>{this.state.success}</Alert> : null}
              {searchresults.length == 0 ? <p>No employee user accounts found.</p> :
                searchresults.map((user) => (
                  user.number === this.state.selected ? selected :
                    <div className="mb-2 border-bottom" style={{ "cursor": "pointer" }} onClick={this.selectUser} name={user.number} key={user.number}>
                      <h5 className="mb-1">{user.name}</h5>
                      <div className="row">
                        <div className="col-md-4">Employee: {user.number}</div>
                        <div className="col-md-4">Admin: {user.admin ? 'YES' : 'NO'}</div>
                        <div className="col-md-4">Disabled: {user.disabled ? 'YES' : 'NO'}</div>
                      </div>
                    </div>
                ))
              }
              <Modal show={this.state.saving} size="sm" onHide={() => { return }}>
                <Modal.Body className="bg-warning">
                  <div className="d-flex flex-direction-column align-items-center justify-content-middle">
                    <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                  </div>
                  <h5 className="text-center text-white mb-0 mt-3 d-block">Saving Changes</h5>
                </Modal.Body>
              </Modal>

              <Modal show={this.state.pinreset && !this.state.saving} onHide={this.closeResetPIN}>
                <Modal.Header closeButton>
                  <Modal.Title>Reset User PIN (A{this.state.selected})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {this.state.error ? <Alert variant="danger" onClose={() => { this.setState({ error: null }) }} dismissible>{this.state.error}</Alert> : null}
                  <p>
                    Reset an employee's PIN to a 4 digit PIN of your choosing.
                  </p>
                  <label>PIN</label>
                  <div className="row mb-3">
                    <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="pin1" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.pin1} name="pin1" /></div>
                    <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="pin2" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.pin2} name="pin2" /></div>
                    <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="pin3" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.pin3} name="pin3" /></div>
                    <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id="pin4" placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.pin4} name="pin4" /></div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.closeResetPIN}>Cancel</Button>
                  <Button variant="primary" onClick={this.resetPIN} disabled={
                    this.state.pin1 == '' || this.state.pin2 == '' ||
                    this.state.pin3 == '' || this.state.pin4 == ''}>Submit</Button>
                </Modal.Footer>
              </Modal>
            </>
            : <>
              <div className="alert alert-danger"><strong>Access Denied</strong><br />Your account is not authorized to access this area.<br className="mb-3" /><Link to="/" className="text-danger">Go back to the main menu.</Link></div>
            </>
        }
      </>
    );
  }
}