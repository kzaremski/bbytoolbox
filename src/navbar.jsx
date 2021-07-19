/**
 * BBY Toolbox / Navbar
 * Konstantin Zaremski
 * -- June 11, 2021
 * 
 * Store change modal
 */

// Import dependencies
import React from 'react';
import { Route, Link } from 'react-router-dom';

// React bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      storechange: false,
      stores: [],

      success: null,
      error: null,

      loading: false,
      changing: false
    }

    // Bind this to component methods.
    this.setStateAsync = this.setStateAsync.bind(this);
    this.loadAllStores = this.loadAllStores.bind(this);
    this.openStoreChange = this.openStoreChange.bind(this);
    this.closeStoreChange = this.closeStoreChange.bind(this);
    this.storeChange = this.storeChange.bind(this);
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async loadAllStores() {
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
      data = { error: 'There was an error while loading the list of stores.' };
    }

    await this.setStateAsync({ ...data });
    if (data.error) return false;
    return true;
  }

  openStoreChange() {
    if (!this.props.multistore) return;

    this.setState({
      storechange: true,
      error: null,
      success: null
    });
    this.loadAllStores();
  }

  closeStoreChange() {
    if (this.state.changing) return;

    this.setState({
      storechange: false
    });
  }

  async storeChange(event) {
    if (this.state.changing) return;
    if (event.target.name === this.props.storenumber) return;

    // Set the state to changing
    this.setStateAsync({ changing: true });

    let data = {};
    try {
      // Load data
      let response = await fetch('/changestore', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        body: JSON.stringify({ store: event.target.name }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
      data = response;
    } catch (err) {s
      console.log(err);
      data = { error: 'There was an error while changing the active store' };
    }

    await this.setStateAsync({ ...data, changing: false });
    if (data.error) return false;

    // Get the information of the currently loggged in users
    window.checkLoginStatus();
    return true;
  }

  render() {
    const storelist = this.state.stores.map((store) => (
      <div className="col-lg-3" key={store.number}>
        <button className={"btn btn-block " + (this.props.storenumber == store.number ? "btn-secondary" : "btn-light")} onClick={this.storeChange} name={store.number} disabled={this.state.changing}>{store.number}</button>
      </div>
    ));

    return (
      <nav className='navbar navbar-dark bg-primary fixed-top'>
        <div className='container'>
          <Link to='/' className="navbar-brand">
            <img alt='Brand' className='mr-3' src='/static/img/toolbox-icon-only.png' style={{ width: "40px" }} />
            <span>BBY Toolbox</span>
          </Link>
          {this.props.storenumber != null ?
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <span onClick={this.openStoreChange} className={this.props.multistore ? "nav-link" : "text-white"} role={this.props.multistore ? "button" : null}>Location {this.props.storenumber}</span>
              </li>
            </ul> : null}
        </div>

        <Modal show={this.state.storechange} size="lg" onHide={this.closeStoreChange}>
          <Modal.Header closeButton>
            <Modal.Title>Change Active Store</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.error ? <Alert variant="danger" onClose={() => { this.setState({ error: null }) }} dismissible>{this.state.error}</Alert> : null}
            {this.state.success ? <Alert variant="success" onClose={() => { this.setState({ success: null }) }} dismissible>{this.state.success}</Alert> : null}
            {this.state.loading ? <Alert variant="warning">Loading a list of current stores</Alert> : null}
            {this.state.changing ? <Alert variant="warning">Your current store is being changed</Alert> : null}

            <p>As an employee with access to multiple stores, choose the one you would like to use the application as.</p>

            <div className="row">
              {this.state.stores.length == 0 ? <p className="small ml-5">No stores are defined.</p> : storelist}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.closeStoreChange}>Close</Button>
          </Modal.Footer>
        </Modal>
      </nav>
    );
  }
}