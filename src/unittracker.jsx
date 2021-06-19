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
        <h5><strong>COMPUTING SALE UNIT TRACKER</strong></h5>
        <div>
          <button className="btn btn-info mr-2 mb-2">Set Goals</button>
          <button className="btn btn-warning mr-2 mb-2">EOD Report</button>
          <button className="btn btn-success mb-2">New Sale</button>
        </div>
        <div className="mt-1 mb-3">
          <div className="d-flex flex-direction-row">
            <div className="mr-3">
              <h5><small>TOP MEMBERSHIP PERFORMER:</small></h5>
            </div>
            <div>
              <h5><strong>N/A</strong></h5>
            </div>
          </div>
          <div className="d-flex flex-direction-row">
            <div className="mr-3">
              <h5><small>MICROSOFT 365/OFFICE ATTACH RATIO:</small></h5>
            </div>
            <div>
              <h5><strong>N/A</strong></h5>
            </div>
          </div>
        </div>
        <h5>TOTALS</h5>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th className="col-3"><small>Item</small></th>
                <th>Current</th>
                <th>Goal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Windows OEM</td>
                <td>N/A</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Microsoft 365 &amp; Office</td>
                <td>N/A</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Microsoft Surface Devices</td>
                <td>N/A</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Total Tech Support</td>
                <td>N/A</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Best Buy Card Applications</td>
                <td>N/A</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h5>BREAKDOWN BY EMPLOYEE</h5>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th><small>Employee</small></th>
                <th>OEM</th>
                <th>Office</th>
                <th>Surface</th>
                <th>TTS</th>
                <th>BP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>No sales have been recorded yet.</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}