import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext/index';
import Preview from './Preview';
import Home from './Home';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import Projects from './Projects';
import ProjectDetails from './ProjectDetails';
import Invitations from './Invitations';
import Settings from './Settings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/About" element={<About />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
        <Route path="/projects/:projectId" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
        <Route path="/Invitations" element={<PrivateRoute><Invitations /></PrivateRoute>} />
        <Route path="/Home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/preview/:projectId/:fileId" element={<PrivateRoute><Preview /></PrivateRoute>} />
        <Route path="/Settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;