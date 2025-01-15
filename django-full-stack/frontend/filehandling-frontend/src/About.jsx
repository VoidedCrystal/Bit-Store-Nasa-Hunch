import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function About() {
  const openNav = () => {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };

  const closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navdiv">
          <div id="mySidebar" className="sidebar">
            {//eslint-disable-next-line
            } <a href="#" className="closebtn" onClick={closeNav}>×</a>
            {//eslint-disable-next-line
            }<a href="#">Filler</a>
            {//eslint-disable-next-line
            }<a href="./Documents">Projects</a>
            {//eslint-disable-next-line
            }<a href="#">Settings</a>
            {//eslint-disable-next-line
            }<a href="#">Filler</a>
          </div>
          <div id="main">
            <button className="openbtn" onClick={openNav}>☰</button>
          </div>
          <div className="logo">
            <Link to="/">
              <img src="/assets/pfp-update.png" alt="Bit Store Logo" height="100px" />
            </Link>
          </div>
          <ul>
            <li><Link to="/About">About</Link></li>
            <button><Link to="/auth/login">Login</Link></button>
            <button><Link to="/auth/sign_up">Sign Up</Link></button>
          </ul>
        </div>
      </nav>
      <h1>About Bit-Store</h1>
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