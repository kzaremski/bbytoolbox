/**
 * PIN Input
 * Konstantin Zaremski
 * July 11, 2021
 */

// Import dependencies
import React from 'react';

export default class PINinput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pin1: ' ',
      pin2: ' ',
      pin3: ' ',
      pin4: ' '
    };

    // Bind this to component methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  // Handle individual keypresses
  handleKeyDown(event) {
    const pinIDs = this.props.name ?
                [this.props.name + '_pin1', this.props.name + '_pin2', this.props.name + '_pin3', this.props.name + '_pin4'] :
                ['pin1', 'pin2', 'pin3', 'pin4'];
    const pins = ['pin1', 'pin2', 'pin3', 'pin4'];
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    // Cycle through the PIN digits
    if (pins.includes(event.target.name)) {
      event.preventDefault();
      const currentPin = event.target.name;
      if (numbers.includes(event.key)) {
        this.setState({ [currentPin]: event.key }, () => {
          // Cycle through the PIN digits
          if (pins.indexOf(currentPin) < pins.length - 1) document.getElementById(pinIDs[pins.indexOf(currentPin) + 1]).focus();
          else {
            document.activeElement.blur();
            this.onEnd();
          }
          this.onChange();
        });
      }
      if (event.which == 8) {
        this.setState({ [currentPin]: ' ' }, () => {
          if (pins.indexOf(currentPin) === 0) document.activeElement.blur();
          if (pins.indexOf(currentPin) > 0) document.getElementById(pinIDs[pins.indexOf(currentPin) - 1]).focus();
          this.onChange();
        });
      }
    }
  }

  onChange() {
    if (this.props.onChange) this.props.onChange({
      target: {
        name: this.props.name,
        value: this.state.pin1 + this.state.pin2 + this.state.pin3 + this.state.pin4
      }
    });
  }

  onEnd() {
    if (this.props.onEnd) this.props.onEnd();
  }

  handleChange() { return }

  render() {
    // Corrected value from parent
    let values = [this.props.value[0] || ' ', this.props.value[1] || ' ', this.props.value[2] || ' ', this.props.value[3] || ' '];

    return (
      <div className="row">
        <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id={(this.props.name ? this.props.name + "_" : "") + "pin1"} placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={values[0]} name="pin1" /></div>
        <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id={(this.props.name ? this.props.name + "_" : "") + "pin2"} placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={values[1]} name="pin2" /></div>
        <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id={(this.props.name ? this.props.name + "_" : "") + "pin3"} placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={values[2]} name="pin3" /></div>
        <div className="col-3"><input autoComplete="off" type="number" className="form-control d-block text-center" id={(this.props.name ? this.props.name + "_" : "") + "pin4"} placeholder="&#8226;" step="1" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={values[3]} name="pin4" /></div>
      </div>
    );
  }
}