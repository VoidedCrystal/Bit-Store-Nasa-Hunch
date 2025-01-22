import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Documents from './Documents';
import Preview from './Preview';
import Home from './Home';
import About from './About';
import Login from './Login';
import Signup from './Signup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Documents" element={<Documents />} />
      <Route path="/Teams" element={<Teams />} />
      <Route path="/Settings" element={<Settings />} />
      <Route path="/preview/:id/:url" element={<Preview />} />
    </Routes>
  );
}

export default App;