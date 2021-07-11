/**
 * 164 Toolbox / Navbar
 * Konstantin Zaremski
 * -- June 11, 2021
 */

import React from 'react';
import { Route, Link } from 'react-router-dom';

export default class Navbar extends React.Component {
  render() {
    return (
      <nav className='navbar navbar-dark bg-primary fixed-top'>
        <div className='container'>
          <Link to='/' className="navbar-brand">
            <img alt='Brand' className='mr-3' src='/static/img/toolbox-icon-only.png' style={{ width: "40px" }} />
            <span>BBY Toolbox</span>
          </Link>
          { window.store != null ?
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <span className="nav-link" role="button" aria-haspopup="true" aria-expanded="false">Location { window.store }</span>
            </li>
          </ul> : null }
        </div>
      </nav>
    );
  }
}