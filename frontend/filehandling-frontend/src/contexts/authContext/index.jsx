import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmail as firebaseUpdateEmail, updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { doSignInWithGoogle } from '../../firebase/auth'; // Import the Google sign-in function

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email
    });
    setCurrentUser(user);
  };

  const signInWithGoogle = async () => {
    const userCredential = await doSignInWithGoogle();
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateEmail = (email) => {
    return firebaseUpdateEmail(currentUser, email);
  };

  const updatePassword = (password) => {
    return firebaseUpdatePassword(currentUser, password);
  };

  const value = {
    currentUser,
    signup,
    signInWithGoogle,
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