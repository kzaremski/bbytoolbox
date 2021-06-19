/**
 * 164 Toolbox / Computing Sale Unit Tracker App
 * 
 * Konstantin Zaremski
 * -- June 15, 2021
 */

// Import dependencies
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default class SaleUnitTracker extends React.Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      employeenumber: '',
      employeename: '',
      newsale: null,
      prevgoals: null,
      goals: {
        oem: 0,
        office: 0,
        surface: 0,
        tts: 0,
        bp: 0
      },
      sales: []
    };

    // A blank new sale
    this.blanknewsale = {
      oem: 0,
      office: 0,
      surface: 0,
      tts: 0,
      bp: 0
    };

    // Bind this to component methods
    this.openNewSale = this.openNewSale.bind(this);
    this.closeNewSale = this.closeNewSale.bind(this);
    this.incrementUnit = this.incrementUnit.bind(this);
    this.decrementUnit = this.decrementUnit.bind(this);
    this.submitSale = this.submitSale.bind(this);
  }

  componentDidMount() {
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename
    });
  }

  // Close the new sale modal, open the new sale modal
  closeNewSale() { this.setState({ newsale: null }) }
  openNewSale() { this.setState({ newsale: JSON.parse(JSON.stringify(this.blanknewsale)) }) }

  // Increment and decrement unit counts for the new sale dialog
  incrementUnit(event) {
    const unit = event.currentTarget.name;
    let newsale = this.state.newsale;
    newsale[unit] = newsale[unit] + 1;
    this.setState({ newsale: newsale });
  }

  decrementUnit(event) {
    const unit = event.currentTarget.name;
    let newsale = this.state.newsale;
    newsale[unit] = newsale[unit] > 0 ? newsale[unit] - 1 : 0;
    this.setState({ newsale: newsale });
  }

  // Submit the new sale
  async submitSale() {
    try {

    } catch(err) {

    }
  }

  render() {
    // Tally up the totals from each individual sale
    let totalsales = {
      oem: 0,
      office: 0,
      surface: 0,
      tts: 0,
      bp: 0
    }

    return (
      <>
        <h5><strong>COMPUTING SALE UNIT TRACKER</strong></h5>
        <div>
          <button disabled className="btn btn-info mr-2 mb-2">Set Goals</button>
          <button disabled className="btn btn-warning mr-2 mb-2">EOD Report</button>
          <button className="btn btn-success mb-2" onClick={this.openNewSale}>New Sale</button>
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
                <td>{totalsales.oem}</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Microsoft 365 &amp; Office</td>
                <td>{totalsales.office}</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Microsoft Surface Devices</td>
                <td>{totalsales.surface}</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Total Tech Support</td>
                <td>{totalsales.tts}</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Best Buy Card Applications</td>
                <td>{totalsales.bp}</td>
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

        <Modal show={this.state.newsale !== null} onHide={this.closeNewSale}>
          <Modal.Header closeButton>
            <Modal.Title>New Sale</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Increment how many units of each category you have sold.
              Your employee number is automatically added to the record of the sale upon submission.
            </p>
            {this.state.newsale !== null ? <>
              <div className="row mb-2">
                <div className="col-7 mt-2">Windows OEM</div>
                <div className="col-2"><Button variant="danger" block disabled={this.state.newsale.oem < 1} onClick={this.decrementUnit} name="oem"><strong>-</strong></Button></div>
                <div className="col-1"><h5 className="mt-2">{this.state.newsale.oem}</h5></div>
                <div className="col-2"><Button variant="success" block disabled={this.state.newsale.oem >= 10} onClick={this.incrementUnit} name="oem"><strong>+</strong></Button></div>
              </div>
              <div className="row mb-2">
                <div className="col-7 mt-2">Microsoft 365 &amp; Office</div>
                <div className="col-2"><Button variant="danger" block disabled={this.state.newsale.office < 1} onClick={this.decrementUnit} name="office"><strong>-</strong></Button></div>
                <div className="col-1"><h5 className="mt-2">{this.state.newsale.office}</h5></div>
                <div className="col-2"><Button variant="success" block disabled={this.state.newsale.office >= 10} onClick={this.incrementUnit} name="office"><strong>+</strong></Button></div>
              </div>
              <div className="row mb-2">
                <div className="col-7 mt-2">Microsoft Surface Devices</div>
                <div className="col-2"><Button variant="danger" block disabled={this.state.newsale.surface < 1} onClick={this.decrementUnit} name="surface"><strong>-</strong></Button></div>
                <div className="col-1"><h5 className="mt-2">{this.state.newsale.surface}</h5></div>
                <div className="col-2"><Button variant="success" block disabled={this.state.newsale.surface >= 5} onClick={this.incrementUnit} name="surface"><strong>+</strong></Button></div>
              </div>
              <div className="row mb-2">
                <div className="col-7 mt-2">Total Tech Support</div>
                <div className="col-2"><Button variant="danger" block disabled={this.state.newsale.tts < 1} onClick={this.decrementUnit} name="tts"><strong>-</strong></Button></div>
                <div className="col-1"><h5 className="mt-2">{this.state.newsale.tts}</h5></div>
                <div className="col-2"><Button variant="success" block disabled={this.state.newsale.tts >= 2} onClick={this.incrementUnit} name="tts"><strong>+</strong></Button></div>
              </div>
              <div className="row mb-2">
                <div className="col-7 mt-2">Best Buy Card Applications</div>
                <div className="col-2"><Button variant="danger" block disabled={this.state.newsale.bp < 1} onClick={this.decrementUnit} name="bp"><strong>-</strong></Button></div>
                <div className="col-1"><h5 className="mt-2">{this.state.newsale.bp}</h5></div>
                <div className="col-2"><Button variant="success" block disabled={this.state.newsale.bp >= 3} onClick={this.incrementUnit} name="bp"><strong>+</strong></Button></div>
              </div>
            </> : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeNewSale}>Cancel</Button>
            <Button variant="primary">Submit</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}