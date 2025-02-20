import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../../firebase/firebase'; // Import Firebase Auth and Firestore
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateEmail as firebaseUpdateEmail, 
  updatePassword as firebaseUpdatePassword 
} from 'firebase/auth'; // Import Firebase Auth functions
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true); // Force refresh token
          user.superadmin = idTokenResult.claims.superadmin || false;
          setCurrentUser(user);
        } catch (error) {
          console.error('Error getting ID token result:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email
      });
      await sendEmailVerification(user); // Send email verification
      setCurrentUser(user);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user.emailVerified) {
        const idTokenResult = await user.getIdTokenResult(true); // Force refresh token
        user.superadmin = idTokenResult.claims.superadmin || false;
        setCurrentUser(user);
      } else {
        throw new Error('Email not verified');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const updateEmail = async (email) => {
    try {
      await firebaseUpdateEmail(currentUser, email);
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  const updatePassword = async (password) => {
    try {
      await firebaseUpdatePassword(currentUser, password);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    userLoggedIn: () => setCurrentUser(auth.currentUser)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}