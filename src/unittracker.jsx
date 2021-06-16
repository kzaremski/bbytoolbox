/**
 * 164 Toolbox / Computing Sale Unit Tracker App
 * 
 * Konstantin Zaremski
 * -- June 15, 2021
 */

// Import dependencies
import React from 'react';
import { Link } from 'react-router-dom';

export default class SaleUnitTracker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      employeename: '',
    }
  }

  componentDidMount() {
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename
    });
  }

  render() {
    return (
      <>
        <div>
          <strong>COMPUTING SALE UNIT TRACKER</strong>
        </div>
      </>
    );
  }
}