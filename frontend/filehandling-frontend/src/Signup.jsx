import React, { useState } from 'react';
import { useAuth } from './contexts/authContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { db } from './firebase/firebase'; // Import Firestore
import { doc, getDoc, setDoc} from 'firebase/firestore'; // Import Firestore functions
import './css/auth.css';
import { doSignInWithGoogle } from './firebase/auth'

function Signup() {
  const { signup, currentUser, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);
    try {
      await signup(email, password, username);
      if (currentUser) {
        return <Navigate to="/Home" />; // Redirect to /Home
      }
      
    } catch (error) {
      setErrorMessage(error.message);
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSignIn(true);
    try {
      const userCredential = await doSignInWithGoogle();
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        setIsGoogleSignIn(false);
        setIsSigningUp(true);
      } else {
        setIsGoogleSignIn(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setIsGoogleSignIn(false);
    }
  };

  const handleUsernameSubmit = async (e) => {
    return <Navigate to="/Home" />; // Redirect to /Home
  };

  if (currentUser) {
    return <Navigate to="/Home" />;
  }

  return (
    <div>
      <img src="../assets/bitsore3.png" height="90px"/>
      <div className="Authbox">
        <h2>Sign Up for Bit-Store</h2>
        {!isSigningUp && !isGoogleSignIn && (
          <form onSubmit={onSubmit}>
            <p><label htmlFor="Username">Username</label></p>
            <input
              type="text"
              name="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p><label htmlFor="Email">Email</label></p>
            <input
              type="email"
              name="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p><label htmlFor="Password">Password</label></p>
            <input
              type="password"
              name="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p></p>
            <input className="submit" type="submit" name="Signup" value="Sign Up" disabled={isSigningUp} />
          </form>
        )}
        {isGoogleSignIn && (
          <div>
            <p>Signing in with Google...</p>
          </div>
        )}
        {errorMessage && <p>{errorMessage}</p>}
        {!isSigningUp && !isGoogleSignIn && (
          <button onClick={handleGoogleSignIn} disabled={isSigningUp} className='Google'><div><img src="../assets/GoogleLogo.png" height="25px"/></div><span className='Google'>Sign in with Google</span></button>
        )}
      </div>
      <p></p>
      <div className="linkbox">
        <h5>Already have an account? <Link to="/Login"><p>Login</p></Link></h5>
      </div>
    </div>
  );
}

export default Signup;