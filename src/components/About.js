import React from 'react';
import { FaTimes, FaCode, FaGlobe, FaClock, FaGithub } from 'react-icons/fa';
import './About.css';

function About({ onClose }) {
  return (
    <div className="about-overlay" onClick={onClose}>
      <div className="about-box" onClick={(e) => e.stopPropagation()}>
        <button className="about-close" onClick={onClose}>
          <FaTimes size={13} />
        </button>

        <div className="about-title">
          <span className="about-title-small">About</span>
          <span className="about-title-big">
            <span className="piggy">Piggy</span>
            <span className="bank">Bank</span>
          </span>
        </div>
        <p className="about-desc">
          A personal finance tracker that lets you manage income and expenses easily, with Excel import and export support.
        </p>

        <ul className="about-list">
          <li className="about-item">
            <span className="about-icon"><FaCode size={16} /></span>
            <div>
              <strong>Stack</strong>
              <span>React + Bootstrap</span>
            </div>
          </li>
<li className="about-item">
            <span className="about-icon"><FaGlobe size={16} /></span>
            <div>
              <strong>Deploy</strong>
              <span>Hosted by GitHub Pages</span>
            </div>
          </li>
          <li className="about-item">
            <span className="about-icon"><FaClock size={16} /></span>
            <div>
              <strong>Version</strong>
              <span>1.0.0</span>
            </div>
          </li>
          <li className="about-item">
            <span className="about-icon"><FaGithub size={16} /></span>
            <div>
              <strong>Developed by</strong>
              <a href="https://andresnicolas.com" target="_blank" rel="noreferrer">Andres Nicolas</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default About;