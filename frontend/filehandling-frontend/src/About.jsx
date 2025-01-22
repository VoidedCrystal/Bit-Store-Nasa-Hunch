import React from 'react';
//eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './css/styles.css';

function About() {
  return (
    <div>
      <nav className="navbar">
        <div className="navdiv">
          <div className="logo">
            <a href="./style.css">
              <img src="/assets/pfp-update.png" alt="Bit Store Logo" height="100px" />
            </a>
          </div>
          <ul>
            <li><Link to="/About">About</Link></li>
            <button><Link to="/login">Login</Link></button>
            <button><Link to="/signup">Sign Up</Link></button>
          </ul>
        </div>
      </nav>
      <h1>Bit-Store</h1>
      <p>Bit-Store will store NASA HUNCH projects in a safe and protected environment.</p>
      <h1>Not Just A Repository</h1>
      <p>Bit-Store will allow file sharing and version control and perform automated back-ups</p>
      <h1>Minimal Risk</h1>
      <p>
        Unlike USB drives, projects will be accessible from anywhere with no risk of being stolen, lost, or damaged.
        The only risk we may encounter is data breaches, but we will have security measures in place to prevent that.
      </p>
    </div>
  );
}

export default About;