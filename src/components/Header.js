import React from 'react';
import piggyBankImage from '../assets/images/piggybank.png';
import './Header.css';

function Header() {
  return (
    <div className="header-container">
      <img src={piggyBankImage} alt="Piggy Bank" className="header-logo" />
      <h1 className="header-title">
        <span className="title-text">
          <span className="piggy">piggy</span>
          <span className="bank">bank</span>
        </span>
      </h1>
      <p className="header-subtitle">Control your finances easily</p>
    </div>
  );
}

export default Header;