import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import piggyBankImage from '../assets/images/piggybank.png';
import About from './About';
import './Header.css';

function Header() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <div className="header-container">
        <button className="header-info-btn" onClick={() => setShowAbout(true)} title="About">
          <FaInfoCircle size={18} />
        </button>
        <img src={piggyBankImage} alt="Piggy Bank" className="header-logo" />
        <h1 className="header-title">
          <span className="title-text">
            <span className="piggy">Piggy</span>
            <span className="bank">Bank</span>
          </span>
        </h1>
        <p className="header-subtitle">Control your finances easily</p>
      </div>

      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </>
  );
}

export default Header;