import React from 'react';
import { Link } from 'react-router-dom';


const PaymentHeader = () => {
  return (
    <header>
        <nav className="navbar navbar-expand-lg py-5 justify-content-center" style={{padding: "0 0.75rem"}}>
        <div className="header-logo-navbar">
          <Link to={'/'} className="navbar-brand fw-bold">BandesDessinées</Link>
        </div>
      </nav>
    </header>
  );
}

export default PaymentHeader;
