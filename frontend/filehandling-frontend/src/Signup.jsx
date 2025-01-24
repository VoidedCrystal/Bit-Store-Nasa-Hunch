import React, { useState } from 'react';
import { useAuth } from './contexts/authContext';
import { Link, Navigate } from 'react-router-dom';
import { db } from './firebase/firebase'; // Import Firestore
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import './css/auth.css';

function Signup() {
  const { signup, currentUser, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);
        try {
            await doCreateUserwithEmailAndPassword(email, password);
            userLoggedIn();
        } catch (error) {
            setErrorMessage(error.message);
            setIsSigningIn(false);
        }
    }

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);
        try {
            await doSignInWithGoogle();
            userLoggedIn();
        } catch (error) {
            setErrorMessage(error.message);
            setIsSigningIn(false);
        }
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit" disabled={isSigningIn}>
                    Sign Up
                </button>
                {errorMessage && <p>{errorMessage}</p>}
            </form>
            <button onClick={onGoogleSignIn} disabled={isSigningIn}>Sign up with Google</button>
        </div>
    );
}

export default Signup;