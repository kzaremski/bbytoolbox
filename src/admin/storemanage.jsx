/**
 * BBY Toolbox / Admin Store Managenment
 * 
 * Konstantin Zaremski
 * -- July 13, 2021
 */

// Import dependencies
import React from 'react';
import { Link } from 'react-router-dom';

// Font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faUserEdit, faKey, faAssistiveListeningSystems } from '@fortawesome/free-solid-svg-icons';

// Selectors
import TimeZoneSelectorInput from '../components/timezoneselectorinput.jsx';
import StateSelectorInput from '../components/stateselectorinput.jsx';

// React bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default class AdminStoreManage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      employeename: '',
      isadmin: false,

      success: null,
      error: null,

      newstore: false,
      editstore: false,

      search: '',
      selected: null,
      stores: [],

      // Blank store
      number: '',
      name: '',
      district: '',
      timezone: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',

      saving: false
    }

    // Bind this to component methods
    this.selectStore = this.selectStore.bind(this);
    this.deselectStore = this.deselectStore.bind(this);
    this.getAllStores = this.getAllStores.bind(this);

    this.setStateAsync = this.setStateAsync.bind(this);

    this.handleChange = this.handleChange.bind(this);

    // Edit store

    // New store
    this.openNewStore = this.openNewStore.bind(this);
    this.closeNewStore = this.closeNewStore.bind(this);
    this.newStore = this.newStore.bind(this);

    this.clearSearch = this.clearSearch.bind(this);
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async getAllStores() {
    let data = {};
    try {
      // Load data
      let response = await fetch('/getstores', {
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
    await this.setStateAsync({ ...data });
    return true;
  }

  componentDidMount() {
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename,
      isadmin: window.isadmin
    });
    this.getAllStores();
  }

  // Select a user
  selectStore(event) {
    const clicked = event.currentTarget.getAttribute('name');
    this.setState({
      selected: clicked,
      success: null,
      error: null
    });
  }

  // Deselect the current'y selected user
  deselectStore() {
    this.setState({
      selected: null,
      success: null,
      error: null
    })
  }

  // Open the user edit GUI
  openEditStore() {
    // Get the object of the selected user
    const selectedUser = this.state.users.find(user => {
      return user.number === this.state.selected;
    });

    this.setState({
      edituser: true,
      success: null,
      error: null,

      name: selectedUser.name || '',
      number: selectedUser.number || '',
      store: selectedUser.store || '',
      disabled: selectedUser.disabled || false
    });
  }

  closeEditStore() {
    this.setState({ edituser: false });
  }

  // Edit a user's information
  editStore() {
    this.setState({ saving: true }, async () => {
      let data = {};
      try {
        // Load data
        let response = await fetch('/admin/editemployee', {
          method: 'POST',
          mode: 'same-origin',
          cache: 'no-cache',
          credentials: 'same-origin',
          body: JSON.stringify({
            employeenumber: this.state.selected,
            name: this.state.name,
            store: this.state.store,
            disabled: this.state.disabled,
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json());
        data = response;
      } catch (err) {
        console.log(err);
        data = { error: 'There was an error parsing the response from the backend. Possible errors: 404, 500.' };
      }

      this.setState({
        ...data,
        saving: false
      });

      if (!data.error) this.closeEditUser();
      this.getAllUsers();
    });
  }

  // Open the new user GUI
  openNewStore() {
    this.clearSearch();
    this.deselectStore();
    this.setState({
      newstore: true,
      success: null,
      error: null,

      // Blank the data
      number: '',
      name: '',
      district: '',
      timezone: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  closeNewStore() {
    this.setState({ newstore: false });
  }

  newStore() {
    if (this.state.number == '' || this.state.name == '' || this.state.timezone == '') return this.setState({ error: 'Store number, name, and timezone must not be empty' });

    this.setState({ saving: true }, async () => {
      let data = {};
      try {
        // Load data
        let response = await fetch('/admin/newstore', {
          method: 'POST',
          mode: 'same-origin',
          cache: 'no-cache',
          credentials: 'same-origin',
          body: JSON.stringify({
            number: this.state.number,
            name: this.state.name,
            district: this.state.district,
            timezone: this.state.timezone,
            address: {
              street1: this.state.street1,
              street2: this.state.street2,
              city: this.state.city,
              state: this.state.state,
              zip: this.state.zip
            }
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json());
        data = response;
      } catch (err) {
        console.log(err);
        data = { error: 'There was an error parsing the response from the backend. Possible errors: 404, 500.' };
      }

      this.setState({
        ...data,
      });


      this.setState({ saving: false });

      if (!data.error) {
        this.closeNewStore();
        await this.getAllStores().then(() => {
          this.setState({ selected: this.state.number });
          document.getElementById('selectedstore').scrollIntoView();
        });
      };
    });
  }

  // Handle input changes
  handleChange(event) {
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name === 'number' || name === 'district') value = value.replace(/\D/g, '');

    this.setState({
      [name]: value
    });
  }

  // Clear the search (button)
  clearSearch() { this.setState({ search: '' }) }

  render() {
    if (this.state.isadmin) return (
      <>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Toolbox</Link></li>
          <li className="breadcrumb-item"><Link to="/admin">System Admin</Link></li>
          <li className="breadcrumb-item active">Store Management</li>
        </ol>
        <div className="d-flex flex-direction-row align-items-start mb-2">
          <h5 className="mt-1"><strong>STORE MANAGEMENT</strong></h5>
          <Button variant="success" className="ml-auto" onClick={this.openNewStore}><FontAwesomeIcon icon={faUserPlus} className="mr-2" />New store</Button>
        </div>
        <div className="d-flex flex-direction-row mb-3">
          <div className="mr-3 flex-grow-1">
            <input className="form-control" type="text" name="search" placeholder="Search by location name or number" onChange={this.handleChange} value={this.state.search} />
          </div>
          <Button variant="danger" disabled={this.state.search.length === 0} onClick={this.clearSearch}><FontAwesomeIcon icon={faTimes} /></Button>
        </div>

        <Modal show={this.state.newstore && !this.state.saving} size="lg" onHide={this.closeNewStore}>
          <Modal.Header closeButton>
            <Modal.Title>New Store</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.error ? <Alert variant="danger" onClose={() => { this.setState({ error: null }) }} dismissible>{this.state.error}</Alert> : null}

            <p>Add a new location to the unit tracker application.</p>

            <div className="form-group row">
              <label htmlFor="number-new" className="col-sm-2 col-form-label">Number</label>
              <div className="col-sm-10">
                <input type="number" className="form-control" min="0" max="50000" id="store-new" value={this.state.number} onChange={this.handleChange} name="number" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="name-new" className="col-sm-2 col-form-label">Name</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" id="name-new" value={this.state.name} onChange={this.handleChange} name="name" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="timezone-new" className="col-sm-2 col-form-label">Time Zone</label>
              <div className="col-sm-10">
                <TimeZoneSelectorInput value={this.state.timezone} id="timezone-new" onChange={this.handleChange} name="timezone" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="district-new" className="col-sm-2 col-form-label">District</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" id="district-new" value={this.state.district} onChange={this.handleChange} name="district" />
              </div>
            </div>
            <label>Address</label>
            <div className="form-group row">
              <div className="col-md-6 mb-3">
                <input type="text" className="form-control" value={this.state.street1} onChange={this.handleChange} name="street1" placeholder="Street address"/>
              </div>
              <div className="col-md-6 mb-3">
                <input type="text" className="form-control" value={this.state.street2} onChange={this.handleChange} name="street2" placeholder="Suite or building number"/>
              </div>
              <div className="col-md-4 mb-3">
                <input type="text" className="form-control" value={this.state.city} onChange={this.handleChange} name="city" placeholder="City"/>
              </div>
              <div className="col-md-4 mb-3">
                <StateSelectorInput value={this.state.state} onChange={this.handleChange} name="state" />
              </div>
              <div className="col-md-4 mb-3">
                <input type="text" className="form-control" value={this.state.zip} onChange={this.handleChange} name="zip" placeholder="ZIP code"/>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeNewStore}>Cancel</Button>
            <Button variant="primary" onClick={this.newStore} disabled={false}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </>
    );

    // If this point is reached it can be assumed that the user does not have administrator priveleges
    return (
      <div className="alert alert-danger"><strong>Access Denied</strong><br />Your account is not authorized to access this area.<br className="mb-3" /><Link to="/" className="text-danger">Go back to the main menu.</Link></div>
    );
  }
}