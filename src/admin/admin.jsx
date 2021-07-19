/**
 * 164 Toolbox / Admin Screen
 * 
 * Konstantin Zaremski
 * -- June 27, 2021
 */

// Import dependencies
import React from 'react';
import { Link } from 'react-router-dom';

export default class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeenumber: '',
      employeename: '',
      isadmin: false
    }
  }

  componentDidMount() {
    this.setState({
      employeenumber: window.employeenumber,
      employeename: window.employeename,
      isadmin: window.isadmin
    });
  }

  render() {
    const FirstNameL = this.state.employeename.split(' ').length > 1 ?
      this.state.employeename.split(' ')[0] + ' ' + this.state.employeename.split(' ')[1].substring(0, 1) :
      this.state.employeename;

    return (
      <>
        {this.state.isadmin ?
          <>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Toolbox</Link></li>
              <li className="breadcrumb-item active">System Admin</li>
            </ol>
            <div className="d-flex flex-direction-row mb-3">
              <div className="mt-2">Welcome, <strong>{FirstNameL}</strong>.</div>
            </div>
            <div className="row">
              <div className="col-sm-6"><Link to="/admin/usermanage" className="text-decoration-none"><button className="btn btn-block btn-primary mb-3">User Management</button></Link></div>
              <div className="col-sm-6"><Link to="/admin/storemanage" className="text-decoration-none"><button className="btn btn-block btn-primary mb-3">Store Management</button></Link></div>
              <div className="col-sm-6"><Link to="/admin/computingsales" className="text-decoration-none"><button className="btn btn-block btn-primary mb-3" disabled>Computing Sale Data Management</button></Link></div>
              <div className="col-sm-6"><Link to="/admin/accesslogs" className="text-decoration-none"><button className="btn btn-block btn-primary mb-3" disabled>Access Logs</button></Link></div>
            </div>
          </>
          : <>
            <div className="alert alert-danger"><strong>Access Denied</strong><br />Your account is not authorized to access this information or make changes to application system settings.<br className="mb-3" /><Link to="/" className="text-danger">Go back to the main menu.</Link></div>
          </>}
      </>
    );
  }
}