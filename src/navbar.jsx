/**
 * 164 Toolbox / Navbar
 * Konstantin Zaremski
 * -- June 11, 2021
 */

import React from 'react';

export default class Navbar extends React.Component {
  render() {
    return (
      <nav className='navbar navbar-dark bg-primary fixed-top'>
        <div className='container'>
          <div className='navbar-header'>
            <a className='navbar-brand' href='#'>
              <img alt='Brand' className='mr-3' src='/static/img/toolbox-icon-only.png' style={{ width: "40px" }}/>
              <span>164 Toolbox</span>
            </a>
          </div>
        </div>
      </nav>
    );
  }
}