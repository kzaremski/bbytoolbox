/**
 * TIME ZONE SELECTOR INPUT
 */

 import React from 'react';

 // Time Zone Selector Input Dropdown
 export default class TimeZoneSelectorInput extends React.Component {
   // Rely entirely on the parent
   render() {
     return (
       <select className='form-control' name={this.props.name} value={this.props.value} onChange={this.props.onChange}>
         <option value=''> - Choose Time Zone - </option>
         <option value='America/New_York'>America/New_York (Eastern)</option>
         <option value='America/Houston'>America/Houston (Central)</option>
         <option value='America/Denver'>America/Denver (Mountain)</option>
         <option value='America/Los_Angeles'>America/Los_Angeles (Pacific)</option>
       </select>
     );
   }
 }