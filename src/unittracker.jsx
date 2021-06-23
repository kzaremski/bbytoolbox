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
import Alert from 'react-bootstrap/Alert';

export default class SaleUnitTracker extends React.Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      saving: false,
      updating: false,
      error: null,
      success: null,
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
    this.updateCurrentSales = this.updateCurrentSales.bind(this);
    // New Sale Functionality
    this.openNewSale    = this.openNewSale.bind(this);
    this.closeNewSale   = this.closeNewSale.bind(this);
    this.incrementUnit  = this.incrementUnit.bind(this);
    this.decrementUnit  = this.decrementUnit.bind(this);
    this.submitSale     = this.submitSale.bind(this);
    // Goal Modification
    this.openEditGoals  = this.openEditGoals.bind(this);
    this.closeEditGoals = this.closeEditGoals.bind(this);
    this.incrementGoal  = this.incrementGoal.bind(this);
    this.decrementGoal  = this.decrementGoal.bind(this);
    this.submitGoals    = this.submitGoals.bind(this);
  }

  // Update current sales
  async updateCurrentSales() {
    this.setState({ updating: true }, async () => {
      let data = {};
      try {
        // Load data
        let response = await fetch('/saletracker/getsales', {
          method: 'POST',
          mode: 'same-origin',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json());
        data = response;
        if (!data.goals) data.goals = this.state.goals;
      } catch (err) {
        console.log(err);
        if (response) console.log(response);
        data = { error: 'There was an error parsing the response from the backend. Possible errors: 404, 500.' };
      }
      this.setState({ ...data, updating: false });
    });
  }

  componentDidMount() {
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename
    });
    // Get a list of the current sales
    this.updateCurrentSales();
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
    this.setState({ saving: true }, async () => {
      let data = {};
      try {
        // Load data
        let response = await fetch('/saletracker/submitsale', {
          method: 'POST',
          mode: 'same-origin',
          cache: 'no-cache',
          credentials: 'same-origin',
          body: JSON.stringify({
            sale: this.state.newsale,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
           }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json());
        data = response;
      } catch (err) {
        console.log(err);
        if (response) console.log(response);
        data = { error: 'There was an error parsing the response from the backend. Possible errors: 404, 500.' };
      }
      
      this.setState({ ...data, saving: false, newsale: null });
      this.updateCurrentSales();
    });
  }

  // Open/Close Goal Editor
  closeEditGoals() { this.setState({ prevgoals: null }) }
  openEditGoals() { this.setState({ prevgoals: JSON.parse(JSON.stringify(this.state.goals)) }) }

  // Increment and decrement unit counts for sales goals
  incrementGoal(event) {
    const unit = event.currentTarget.name;
    let goals = this.state.prevgoals;
    goals[unit] = goals[unit] + 1;
    this.setState({ prevgoals: goals });
  }

  decrementGoal(event) {
    const unit = event.currentTarget.name;
    let goals = this.state.prevgoals;
    goals[unit] = goals[unit] > 0 ? goals[unit] - 1 : 0;
    this.setState({ prevgoals: goals });
  }

  // Submit the new sale
  async submitGoals() {
    this.setState({ saving: true }, async () => {
      let data = {};
      try {
        // Load data
        let response = await fetch('/saletracker/submitgoals', {
          method: 'POST',
          mode: 'same-origin',
          cache: 'no-cache',
          credentials: 'same-origin',
          body: JSON.stringify({
            goals: this.state.prevgoals,
           }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json());
        data = response;
      } catch (err) {
        console.log(err);
        if (response) console.log(response);
        data = { error: 'There was an error parsing the response from the backend. Possible errors: 404, 500.' };
      }
      
      this.setState({ ...data, saving: false, prevgoals: null });
      this.updateCurrentSales();
    });
  }

  render() {
    // Add all units from individual sales into unified counts
    let salestoday = {
      oem: 0,
      office: 0,
      surface: 0,
      tts: 0,
      bp: 0
    };

    let salesbyemployee = {};
    // Create entries for all of the employees
    for (const sale of this.state.sales) { salesbyemployee[sale.employee.number] = { ...salestoday, name: sale.employee.name } }

    // Loop through and add
    for (const sale of this.state.sales) {
      for (const unit in sale.units) {
        salestoday[unit] += sale.units[unit];
        salesbyemployee[sale.employee.number][unit] += sale.units[unit];
      }
    }

    // Add up all of the units in the new sale (if defined)
    let totalnewsales = 0;
    if (this.state.newsale !== null) {
      for (const unit in this.state.newsale) {
        totalnewsales += this.state.newsale[unit];
      }
    }

    // Calculate office attach percentage
    const officeattach = salestoday.oem + salestoday.surface > 0 ? salestoday.office / (salestoday.oem + salestoday.surface) : salestoday.office;

    return (
      <>
        <h5><strong>COMPUTING SALE UNIT TRACKER</strong></h5>
        { this.state.updating ? <Alert variant="warning">Please wait while sales and goals are loaded</Alert> : null }
        { this.state.error ? <Alert variant="danger" onClose={() => { this.setState({ error: null }) }} dismissible>{this.state.error}</Alert> : null }
        { this.state.success ? <Alert variant="success" onClose={() => { this.setState({ success: null }) }} dismissible>{this.state.success}</Alert> : null }
        <div>
          <button className="btn btn-info mr-2 mb-2" onClick={this.openEditGoals}>Set Goals</button>
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
              <h5><strong>{ (officeattach * 100).toFixed(2) }%</strong></h5>
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
                <td>{salestoday.oem}</td>
                <td>{this.state.goals.oem || 'N/A'}</td>
              </tr>
              <tr>
                <td>Microsoft 365 &amp; Office</td>
                <td>{salestoday.office}</td>
                <td>{this.state.goals.office || 'N/A'}</td>
              </tr>
              <tr>
                <td>Microsoft Surface Devices</td>
                <td>{salestoday.surface}</td>
                <td>{this.state.goals.surface || 'N/A'}</td>
              </tr>
              <tr>
                <td>Total Tech Support</td>
                <td>{salestoday.tts}</td>
                <td>{this.state.goals.tts || 'N/A'}</td>
              </tr>
              <tr>
                <td>Best Buy Card Applications</td>
                <td>{salestoday.bp}</td>
                <td>{this.state.goals.bp || 'N/A'}</td>
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
              { Object.keys(salesbyemployee).length === 0 ? <tr>
                <td>No sales have been recorded yet.</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr> : Object.keys(salesbyemployee).map((employeenumber) => (
                <tr key={employeenumber}>
                  <td>
                    { salesbyemployee[employeenumber].name.split(' ').length > 1 ?
                      salesbyemployee[employeenumber].name.split(' ')[0] + ' '
                    + salesbyemployee[employeenumber].name.split(' ')[1].substring(0, 1) + '.' :
                      salesbyemployee[employeenumber].name
                    }
                  </td>
                  <td>{ salesbyemployee[employeenumber].oem }</td>
                  <td>{ salesbyemployee[employeenumber].office }</td>
                  <td>{ salesbyemployee[employeenumber].surface }</td>
                  <td>{ salesbyemployee[employeenumber].tts }</td>
                  <td>{ salesbyemployee[employeenumber].bp }</td>
                </tr>
              )) }
            </tbody>
          </table>
        </div>

        <Modal show={this.state.saving} size="sm" onHide={() => { return }}>
          <Modal.Body className="bg-warning">
            <div className="d-flex flex-direction-column align-items-center justify-content-middle">
              <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
            <h5 className="text-center text-white mb-0 mt-3 d-block">Saving Changes</h5>
          </Modal.Body>
        </Modal>

        <Modal show={this.state.newsale !== null && !this.state.saving} onHide={this.closeNewSale}>
          <Modal.Header closeButton>
            <Modal.Title>New Sale</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Increment how many units of each category you have sold.
              Your employee number is automatically added to the record of the sale upon submission.
            </p>
            {this.state.newsale !== null ? <>
              <div className="d-flex flex-direction-row mb-2">
                <div className="flex-grow-1 w-75 pt-2">Windows OEM</div>
                <div className="flex-shrink-0 ml-3 d-flex flex-direction-row w-25">
                  <Button variant="danger" className="col-4 px-0 text-center" block disabled={this.state.newsale.oem < 1} onClick={this.decrementUnit} name="oem"><strong>-</strong></Button>
                  <h5 className="mt-2 col-4 p-0 text-center">{this.state.newsale.oem}</h5>
                  <Button variant="success" className="col-4 px-0 text-center" block disabled={this.state.newsale.oem >= 10} onClick={this.incrementUnit} name="oem"><strong>+</strong></Button>
                </div>
              </div>
              <div className="d-flex flex-direction-row mb-2">
                <div className="flex-grow-1 w-75 pt-2">Microsoft 365 &amp; Office</div>
                <div className="flex-shrink-0 ml-3 d-flex flex-direction-row w-25">
                  <Button variant="danger" className="col-4 px-0 text-center" block disabled={this.state.newsale.office < 1} onClick={this.decrementUnit} name="office"><strong>-</strong></Button>
                  <h5 className="mt-2 col-4 p-0 text-center">{this.state.newsale.office}</h5>
                  <Button variant="success" className="col-4 px-0 text-center" block disabled={this.state.newsale.office >= 10} onClick={this.incrementUnit} name="office"><strong>+</strong></Button>
                </div>
              </div>
              <div className="d-flex flex-direction-row mb-2">
                <div className="flex-grow-1 w-75 pt-2">Microsoft Surface Devices</div>
                <div className="flex-shrink-0 ml-3 d-flex flex-direction-row w-25">
                  <Button variant="danger" className="col-4 px-0 text-center" block disabled={this.state.newsale.surface < 1} onClick={this.decrementUnit} name="surface"><strong>-</strong></Button>
                  <h5 className="mt-2 col-4 p-0 text-center">{this.state.newsale.surface}</h5>
                  <Button variant="success" className="col-4 px-0 text-center" block disabled={this.state.newsale.surface >= 5} onClick={this.incrementUnit} name="surface"><strong>+</strong></Button>
                </div>
              </div>
              <div className="d-flex flex-direction-row mb-2">
                <div className="flex-grow-1 w-75 pt-2">Total Tech Support</div>
                <div className="flex-shrink-0 ml-3 d-flex flex-direction-row w-25">
                  <Button variant="danger" className="col-4 px-0 text-center" block disabled={this.state.newsale.tts < 1} onClick={this.decrementUnit} name="tts"><strong>-</strong></Button>
                  <h5 className="mt-2 col-4 p-0 text-center">{this.state.newsale.tts}</h5>
                  <Button variant="success" className="col-4 px-0 text-center" block disabled={this.state.newsale.tts >= 2} onClick={this.incrementUnit} name="tts"><strong>+</strong></Button>
                </div>
              </div>
              <div className="d-flex flex-direction-row">
                <div className="flex-grow-1 w-75 pt-2">Best Buy Card Applications</div>
                <div className="flex-shrink-0 ml-3 d-flex flex-direction-row w-25">
                  <Button variant="danger" className="col-4 px-0 text-center" block disabled={this.state.newsale.bp < 1} onClick={this.decrementUnit} name="bp"><strong>-</strong></Button>
                  <h5 className="mt-2 col-4 p-0 text-center">{this.state.newsale.bp}</h5>
                  <Button variant="success" className="col-4 px-0 text-center" block disabled={this.state.newsale.bp >= 3} onClick={this.incrementUnit} name="bp"><strong>+</strong></Button>
                </div>
              </div>
            </> : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeNewSale}>Cancel</Button>
            <Button variant="primary" onClick={this.submitSale} disabled={ totalnewsales == 0 }>Submit</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.prevgoals !== null && !this.state.saving} onHide={this.closeNewSale}>
          <Modal.Header closeButton>
            <Modal.Title>Set Goals</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Increment how many units of each category should be set as a goal for today's operation.
            </p>
            {this.state.prevgoals !== null ? <>
              <div className="d-flex flex-direction-row mb-2">
                <div className="flex-grow-1 w-75 pt-2">Windows OEM</div>
                <div className="flex-shrink-0 ml-3 d-flex flex-direction-row w-25">
                  <Button variant="danger" className="col-4 px-0 text-center" block disabled={this.state.prevgoals.oem < 1} onClick={this.decrementGoal} name="oem"><strong>-</strong></Button>
                  <h5 className="mt-2 col-4 p-0 text-center">{this.state.prevgoals.oem}</h5>
                  <Button variant="success" className="col-4 px-0 text-center" block disabled={this.state.prevgoals.oem >= 50} onClick={this.incrementGoal} name="oem"><strong>+</strong></Button>
                </div>
              </div>
              <div className="d-flex flex-direction-row mb-2">
                <div className="flex-grow-1 w-75 pt-2">Microsoft 365 &amp; Office</div>
                <div className="flex-shrink-0 ml-3 d-flex flex-direction-row w-25">
                  <Button variant="danger" className="col-4 px-0 text-center" block disabled={this.state.prevgoals.office < 1} onClick={this.decrementGoal} name="office"><strong>-</strong></Button>
                  <h5 className="mt-2 col-4 p-0 text-center">{this.state.prevgoals.office}</h5>
                  <Button variant="success" className="col-4 px-0 text-center" block disabled={this.state.prevgoals.office >= 50} onClick={this.incrementGoal} name="office"><strong>+</strong></Button>
                </div>
              </div>
              <div className="d-flex flex-direction-row mb-2">
                <div className="flex-grow-1 w-75 pt-2">Microsoft Surface Devices</div>
                <div className="flex-shrink-0 ml-3 d-flex flex-direction-row w-25">
                  <Button variant="danger" className="col-4 px-0 text-center" block disabled={this.state.prevgoals.surface < 1} onClick={this.decrementGoal} name="surface"><strong>-</strong></Button>
                  <h5 className="mt-2 col-4 p-0 text-center">{this.state.prevgoals.surface}</h5>
                  <Button variant="success" className="col-4 px-0 text-center" block disabled={this.state.prevgoals.surface >= 50} onClick={this.incrementGoal} name="surface"><strong>+</strong></Button>
                </div>
              </div>
              <div className="d-flex flex-direction-row mb-2">
                <div className="flex-grow-1 w-75 pt-2">Total Tech Support</div>
                <div className="flex-shrink-0 ml-3 d-flex flex-direction-row w-25">
                  <Button variant="danger" className="col-4 px-0 text-center" block disabled={this.state.prevgoals.tts < 1} onClick={this.decrementGoal} name="tts"><strong>-</strong></Button>
                  <h5 className="mt-2 col-4 p-0 text-center">{this.state.prevgoals.tts}</h5>
                  <Button variant="success" className="col-4 px-0 text-center" block disabled={this.state.prevgoals.tts >= 50} onClick={this.incrementGoal} name="tts"><strong>+</strong></Button>
                </div>
              </div>
              <div className="d-flex flex-direction-row">
                <div className="flex-grow-1 w-75 pt-2">Best Buy Card Applications</div>
                <div className="flex-shrink-0 ml-3 d-flex flex-direction-row w-25">
                  <Button variant="danger" className="col-4 px-0 text-center" block disabled={this.state.prevgoals.bp < 1} onClick={this.decrementGoal} name="bp"><strong>-</strong></Button>
                  <h5 className="mt-2 col-4 p-0 text-center">{this.state.prevgoals.bp}</h5>
                  <Button variant="success" className="col-4 px-0 text-center" block disabled={this.state.prevgoals.bp >= 50} onClick={this.incrementGoal} name="bp"><strong>+</strong></Button>
                </div>
              </div>
            </> : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeEditGoals}>Cancel</Button>
            <Button variant="primary" onClick={this.submitGoals} disabled={ this.state.prevgoals === this.state.goals }>Save Goals</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}