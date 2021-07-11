/**
 * 164 Toolbox
 * Konstantin Zaremski
 * -- June 11, 2021
 * 
 * The main ReactJS entry point.
 */

// Import the needed packages
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';

// Unique components
import Navbar from './navbar.jsx';
import Login from './login.jsx';

// Routes
import Home from './home.jsx';
import SaleUnitTracker from './unittracker.jsx';
import UserSettings from './usersettings.jsx';
// Admin
import Admin from './admin/admin.jsx';
import AdminUserManage from './admin/usermanage.jsx';

// The main App component
class App extends Component {
  constructor(props) {
    super(props);

    // Setting the initial state
    this.state = {
      loaded: false,
      employeenumber: null
    }

    // Bind local methods to global variables
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
    window.checkLoginStatus = this.checkLoginStatus;
  }

  // Makes a backend request, mutates the related global variables, and returns the results
  async checkLoginStatus() {
    try {
      // Query the backend
      const account = await fetch('/currentuser', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
      // Set the global variables
      window.employeenumber = account.employeenumber;
      window.employeename = account.employeename;
      window.isadmin = account.admin;
    } catch(err) {
      // Set the global variables
      window.employeenumber = null;
      window.employeename = null;
      window.isadmin = false;
    }
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename,
      isadmin: window.isadmin
    });
  }

  componentDidMount() {
    this.checkLoginStatus().then(this.setState({ loaded: true }, () => {
      let splashscreen = document.getElementById('splash');
      setTimeout(() => {
        splashscreen.classList.add('done');
        // Remove the splash screen after it is done animating out.
        setTimeout(() => { splashscreen.parentNode.removeChild(splashscreen) }, 500);
      }, 1000);
    }));

    // Check the login status periodically to make sure that the user is still logged in
    this.loginCheckInterval = setInterval(() => { this.checkLoginStatus() }, 10000);
  }
  
  render() {
    return (
      <Router>
        <Navbar/>
        <div className="container py-3" style={{ 'marginTop': '61px' }}>
          { this.state.loaded && this.state.employeenumber == null ? <Login/> : <>
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/saletracker" exact component={SaleUnitTracker}/>
              <Route path="/admin" exact component={Admin}/>
              <Route path="/admin/usermanage" exact component={AdminUserManage}/>
              <Route path="/user" exact component={UserSettings}/>
            </Switch>
          </> }
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
