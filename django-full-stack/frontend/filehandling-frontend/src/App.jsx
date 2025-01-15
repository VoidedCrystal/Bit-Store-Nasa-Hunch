import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Documents from './Documents';
import Preview from './Preview';
import Home from './Home';
import About from './About';
import Login from './Login';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Documents />} />
        <Route path="/preview/:id/:url" element={<Preview />} />
      </Routes>
    </Router>
  );
}

export default App;