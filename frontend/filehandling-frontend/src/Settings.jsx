import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {openNav, closeNav} from Home;
import './css/styles.css';
import Home from './Home';

function Settings() {
  return (
    <div>
      <nav className="navbar">
              <div className="navdiv">
                <div id="mySidebar" className="sidebar">
                  <a href="#" className="closebtn" onClick={closeNav}>×</a>
                  <Link to="/Invitations">Invitations</Link>
                  <Link to="/Projects">Projects</Link>
                  <Link to="/Settings">Settings</Link>
                  <button onClick={handleLogout} className="logout-btn" to="/About">Sign Out</button>
                </div>
                <div id="main">
                  <button className="openbtn" onClick={openNav}>☰</button>
                </div>
                <div className="logo">
                  <Link to="/">
                    <img src="../assets/pfp-update.png" alt="Bit Store Logo" height="100px" />
                  </Link>
                </div>
              </div>
            </nav>
    </div>
  );
}

export default Settings;