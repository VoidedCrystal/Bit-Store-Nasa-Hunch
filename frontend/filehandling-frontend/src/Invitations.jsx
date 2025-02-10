import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/authContext';
import { db } from './firebase/firebase';
import { Link } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';

function Invitations() {
  const { logout } = useAuth();
  const { currentUser } = useAuth();
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchInvitations = async () => {
      const invitationsRef = collection(db, 'invitations');
      const invitationsSnapshot = await getDocs(invitationsRef);
      const invitationsList = invitationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const userInvitations = invitationsList.filter(invitation => invitation.email === currentUser.email && invitation.status !== 'accepted');
      setInvitations(userInvitations);
    };

    fetchInvitations();
  }, [currentUser]);

  const acceptInvitation = async (invitationId, projectId) => {
    try {
      // Update the invitation status to 'accepted'
      const invitationRef = doc(db, 'invitations', invitationId);
      await updateDoc(invitationRef, { status: 'accepted' });

      // Add the user to the project's members list
      const projectRef = doc(db, 'projects', projectId);
      const projectDoc = await getDoc(projectRef);
      if (projectDoc.exists()) {
        const projectData = projectDoc.data();
        const updatedMembers = [...projectData.members, { email: currentUser.email, role: 'viewer' }];
        await updateDoc(projectRef, { members: updatedMembers });
      }

      // Remove the accepted invitation from the state
      setInvitations(prevInvitations => prevInvitations.filter(invitation => invitation.id !== invitationId));
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const openNav = () => {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };

  const closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div>
            <nav className="navbar">
        <div className="navdiv">
          <div id="mySidebar" className="sidebar">
            <a href="#" className="closebtn" onClick={closeNav}>×</a>
            <Link to="/Invitations">Invitations</Link>
            <Link to="/Projects">Projects</Link>
            <Link to="/Settings">Settings</Link>
            <Link to="/About"><button onClick={handleLogout} className="logout-btn">Sign Out</button></Link>
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
      <h2>Invitations</h2>
      {invitations.length > 0 ? (
        <ul>
          {invitations.map(invitation => (
            <li key={invitation.id}>
              <p>Project ID: {invitation.projectId}</p>
              <button onClick={() => acceptInvitation(invitation.id, invitation.projectId)}>Accept</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No invitations found</p>
      )}
    </div>
  );
}

export default Invitations;