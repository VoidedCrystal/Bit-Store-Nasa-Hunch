import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/authContext';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container missing in index.html');
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();