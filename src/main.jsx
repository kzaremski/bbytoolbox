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

// The main App component
class App extends Component {
  constructor(props) {
    super(props);

    // Setting the initial state
    this.state = {
      user: null,
      loaded: false
    }
  }

  componentDidMount() {
    let splashscreen = document.getElementById('splash');
    setTimeout(() => {
      splashscreen.classList.add('done');
      // Remove the splash screen after it is done animating out.
      setTimeout(() => { splashscreen.parentNode.removeChild(splashscreen) }, 500);
    }, 1000);
  }
  
  render() {
    return (
      <>
        <Navbar/>
        <div className="container pt-3" style={{ 'margin-top': '61px' }}>
          <Login/>
        </div>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
