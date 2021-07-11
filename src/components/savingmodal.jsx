/**
 * "Saving..." Modal
 * Konstantin Zaremski
 * July 11, 2021
 */

// Import dependencies
import React from 'react';
import Modal from 'react-bootstrap/Modal';

export default class SavingModal extends React.Component {
  render() {
    return (
      <Modal show={this.props.show} size="sm" onHide={() => { return }}>
        <Modal.Body className="bg-warning">
          <div className="d-flex flex-direction-column align-items-center justify-content-middle">
            <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
          <h5 className="text-center text-white mb-0 mt-3 d-block">Saving Changes</h5>
        </Modal.Body>
      </Modal>
    );
  }
}