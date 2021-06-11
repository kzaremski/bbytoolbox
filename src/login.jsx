/**
 * 164 Toolbox / Login Screen
 * 
 * Konstantin Zaremski
 * -- June 11, 2021
 */

// Import dependencies
import React from 'react';

export default class Login extends React.Component {
  render() {
    return (
      <div className="d-flex flex-direction-row">
        <div className="col-md-8 col-lg-6 p-0 mx-auto">
          <div className="card bg-light mb-3">
            <h5 className="card-header">Login</h5>
            <div className="card-body">
              <p className="card-text">Changes made are tracked and associated by employee number. Please enter your Best Buy&reg; employee number to continue.</p>
              <div className="form-group">
                <label for="employeenumberinput" className="form-label">Employee Number</label>
                <input type="text" class="form-control" id="employeenumberinput" placeholder="Your employee number" />
                <div className="d-flex flex-direction-row mt-2">
                  <button type="button" class="ml-auto btn btn-primary">Log in</button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted text-center">This is not an official Best Buy&reg; application. Use at your discretion.</p>
          <p className="text-muted text-center">Copyright &copy; 2021 Konstantin Zaremski &mdash; Licensed under the MIT license.</p>
        </div>
      </div>
    );
  }
}