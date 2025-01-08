import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Documents from './Documents';
import Preview from './Preview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Documents />} />
        <Route path="/preview/:id/:url" element={<Preview />} />
      </Routes>
    </Router>
  );
}

export default App;