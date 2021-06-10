/**
 * 164 Toolbox
 * Konstantin Zaremski
 */

// Import the needed packages
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';

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
    
  }
  
  render() {
    return (
      <></>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
