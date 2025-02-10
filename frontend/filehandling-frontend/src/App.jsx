import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import Preview from './Preview';
import Home from './Home';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import Projects from './Projects';
import ProjectDetails from './ProjectDetails';
import Invitations from './Invitations';
import Settings from './Settings';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/About" element={<About />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/Invitations" element={<Invitations />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/preview/:projectId/:fileId" element={<Preview />} />
        <Route path="/Settings" element={<Settings />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;