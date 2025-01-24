import React, { useEffect, useState } from 'react';
import { useAuth } from './contexts/authContext';
import { db } from './firebase/firebase'; // Import Firestore
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore'; // Import Firestore functions

function Invitations() {
  const { currentUser } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchInvitations = async () => {
      if (currentUser) {
        const q = query(collection(db, 'invitations'), where('email', '==', currentUser.email), where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const fetchedInvitations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInvitations(fetchedInvitations);
      }
    };

    fetchInvitations();
  }, [currentUser]);

  const acceptInvitation = async (invitationId, projectId) => {
    try {
      const invitationRef = doc(db, 'invitations', invitationId);
      const projectRef = doc(db, 'projects', projectId);

      // Update the invitation status
      await updateDoc(invitationRef, { status: 'accepted' });

      // Add the user to the project's members
      await updateDoc(projectRef, {
        members: arrayUnion(currentUser.email)
      });

      setMessage('Invitation accepted');
      setInvitations(invitations.filter(invitation => invitation.id !== invitationId));
    } catch (error) {
      setMessage(`Failed to accept invitation: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Invitations</h2>
      {invitations.length > 0 ? (
        <ul>
          {invitations.map(invitation => (
            <li key={invitation.id}>
              Project ID: {invitation.projectId} - Invited by {invitation.invitedBy}
              <button onClick={() => acceptInvitation(invitation.id, invitation.projectId)}>Accept</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending invitations</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Invitations;