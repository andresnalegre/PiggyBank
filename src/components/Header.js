import React from 'react';
import piggyBankImage from '../assets/images/piggybank.png';
import './Header.css';

function Header() {
  return (
    <div className="header-container text-center">
      <h1 className="header-title">
        <img 
          src={piggyBankImage} 
          alt="Piggy Bank" 
          className="header-logo"
        />
        <div className="title-text">
          <span className="piggy">piggy</span>
          <span className="bank">bank</span>
        </div>
      </h1>
      <p className="header-subtitle">Control your finances simply and intelligently</p>
    </div>
  );
}

export default Header;