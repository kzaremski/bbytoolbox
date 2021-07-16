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
import { faTimes, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

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
    this.openEditStore = this.openEditStore.bind(this);
    this.closeEditStore = this.closeEditStore.bind(this);
    this.editStore = this.editStore.bind(this);

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

  // Open the store edit GUI
  openEditStore() {
    // Get the object of the selected store
    const selectedStore = this.state.stores.find(store => {
      return store.number === this.state.selected;
    });

    this.setState({
      editstore: true,
      success: null,
      error: null,

      number: selectedStore.number || '',
      name: selectedStore.name || '',
      district: selectedStore.district || '',
      timezone: selectedStore.timezone || '',
      street1: selectedStore.address.street1 || '',
      street2: selectedStore.address.street2 || '',
      city: selectedStore.address.city || '',
      state: selectedStore.address.state || '',
      zip: selectedStore.address.zip || ''
    });
  }

  closeEditStore() {
    this.setState({ editstore: false });
  }

  // Edit a user's information
  editStore() {
    this.setState({ saving: true }, async () => {
      let data = {};
      try {
        // Load data
        let response = await fetch('/admin/editstore', {
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
        saving: false
      });

      if (!data.error) this.closeEditStore();
      this.getAllStores();
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
    if (this.state.number == '' || this.state.name == '' || this.state.timezone == '') return this.setState({ error: 'Store number, name, and timezone must be valid' });

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
    // Filter down the search results:
    let searchresults = this.state.stores.filter((store) => {
      const searchterm = this.state.search.toLowerCase().replace(/\s+/g, ' ').trim();
      const tosearch = store.name.toLowerCase() + ' ' + store.number;
      return tosearch.includes(searchterm);
    });

    // Get the object of the selected store
    const selectedStore = this.state.stores.find(store => {
      return store.number === this.state.selected;
    });

    const selected = this.state.selected && selectedStore ? (
      <div className="bg-light p-3 my-3" key={selectedStore.number} id="selectedstore">
        {this.state.success ? <Alert variant="success" onClose={() => { this.setState({ success: null }) }} dismissible>{this.state.success}</Alert> : null}
        <h5 className="mb-1">{selectedStore.name}</h5>
        {this.state.error ? <Alert variant="danger" onClose={() => { this.setState({ error: null }) }} dismissible>{this.state.error}</Alert> : null}
        <div className="row mb-2">
          <div className="col-md-4">Location {selectedStore.number}</div>
          <div className="col-md-4">District {selectedStore.district || 'N/A'}</div>
          <div className="col-md-4">Timezone: {selectedStore.timezone || 'N/A'}</div>
          <div className="col-md-6">{selectedStore.address.street1}</div>
          <div className="col-md-6">{selectedStore.address.street2}</div>
          <div className="col-md-4">{selectedStore.address.city}</div>
          <div className="col-md-6">{selectedStore.address.state}</div>
          <div className="col-md-6">{selectedStore.address.zip}</div>
        </div>
        <Button variant="primary" className="mr-2" onClick={this.openEditStore}><FontAwesomeIcon icon={faEdit} className="mr-2" />Edit store</Button>
        <Button variant="secondary" onClick={this.deselectStore}><FontAwesomeIcon icon={faTimes} className="mr-2" />Cancel</Button>
      </div>
    ) : null;

    // If the have admin access render this area
    if (this.state.isadmin) return (
      <>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Toolbox</Link></li>
          <li className="breadcrumb-item"><Link to="/admin">System Admin</Link></li>
          <li className="breadcrumb-item active">Store Management</li>
        </ol>
        <div className="d-flex flex-direction-row align-items-start mb-2">
          <h5 className="mt-1"><strong>STORE MANAGEMENT</strong></h5>
          <Button variant="success" className="ml-auto" onClick={this.openNewStore}><FontAwesomeIcon icon={faPlus} className="mr-2" />New store</Button>
        </div>
        <div className="d-flex flex-direction-row mb-3">
          <div className="mr-3 flex-grow-1">
            <input className="form-control" type="text" name="search" placeholder="Search by location name or number" onChange={this.handleChange} value={this.state.search} />
          </div>
          <Button variant="danger" disabled={this.state.search.length === 0} onClick={this.clearSearch}><FontAwesomeIcon icon={faTimes} /></Button>
        </div>

        {this.state.search.length > 0 ? <p className="small">Search results ({searchresults.length})</p> : null}

        {searchresults.length == 0 ? <p>No store locations found.</p> :
          searchresults.map((store) => (
            store.number === this.state.selected ? selected :
              <div className="mb-2 border-bottom" style={{ "cursor": "pointer" }} onClick={this.selectStore} name={store.number} key={store.number}>
                <h5 className="mb-1">{store.name}</h5>
                <div className="row">
                  <div className="col-md-4">Location {store.number}</div>
                  <div className="col-md-4">District {store.district || 'N/A'}</div>
                  <div className="col-md-4">Timezone: {store.timezone || 'N/A'}</div>
                  <div className="col-md-6">{store.address.street1}</div>
                  <div className="col-md-6">{store.address.street2}</div>
                  <div className="col-md-4">{store.address.city}</div>
                  <div className="col-md-6">{store.address.state}</div>
                  <div className="col-md-6">{store.address.zip}</div>
                </div>
              </div>
          ))
        }
        
        <Modal show={this.state.editstore && !this.state.saving} size="lg" onHide={this.closeEditStore}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Store ({this.state.number}/{this.state.name || 'N/A'})</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.error ? <Alert variant="danger" onClose={() => { this.setState({ error: null }) }} dismissible>{this.state.error}</Alert> : null}

            <p>Edit the information for an existing location.</p>

            <div className="form-group row">
              <label htmlFor="number-edit" className="col-sm-2 col-form-label">Number</label>
              <div className="col-sm-10">
                <p className="mt-2 mb-0">{this.state.number}</p>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="name-edit" className="col-sm-2 col-form-label">Name</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" id="name-edit" value={this.state.name} onChange={this.handleChange} name="name" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="timezone-edit" className="col-sm-2 col-form-label">Time Zone</label>
              <div className="col-sm-10">
                <TimeZoneSelectorInput value={this.state.timezone} id="timezone-edit" onChange={this.handleChange} name="timezone" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="district-edit" className="col-sm-2 col-form-label">District</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" id="district-edit" value={this.state.district} onChange={this.handleChange} name="district" />
              </div>
            </div>
            <label>Address</label>
            <div className="form-group row">
              <div className="col-md-6 mb-3">
                <input type="text" className="form-control" value={this.state.street1} onChange={this.handleChange} name="street1" placeholder="Street address" />
              </div>
              <div className="col-md-6 mb-3">
                <input type="text" className="form-control" value={this.state.street2} onChange={this.handleChange} name="street2" placeholder="Suite or building number" />
              </div>
              <div className="col-md-4 mb-3">
                <input type="text" className="form-control" value={this.state.city} onChange={this.handleChange} name="city" placeholder="City" />
              </div>
              <div className="col-md-4 mb-3">
                <StateSelectorInput value={this.state.state} onChange={this.handleChange} name="state" />
              </div>
              <div className="col-md-4 mb-3">
                <input type="text" className="form-control" value={this.state.zip} onChange={this.handleChange} name="zip" placeholder="ZIP code" />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeEditStore}>Cancel</Button>
            <Button variant="primary" onClick={this.editStore} disabled={false}>Submit</Button>
          </Modal.Footer>
        </Modal>

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
                <input type="text" className="form-control" value={this.state.street1} onChange={this.handleChange} name="street1" placeholder="Street address" />
              </div>
              <div className="col-md-6 mb-3">
                <input type="text" className="form-control" value={this.state.street2} onChange={this.handleChange} name="street2" placeholder="Suite or building number" />
              </div>
              <div className="col-md-4 mb-3">
                <input type="text" className="form-control" value={this.state.city} onChange={this.handleChange} name="city" placeholder="City" />
              </div>
              <div className="col-md-4 mb-3">
                <StateSelectorInput value={this.state.state} onChange={this.handleChange} name="state" />
              </div>
              <div className="col-md-4 mb-3">
                <input type="text" className="form-control" value={this.state.zip} onChange={this.handleChange} name="zip" placeholder="ZIP code" />
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