import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from './firebase/auth';
import { useAuth } from './contexts/authContext';
import './css/auth.css';

function Login() {
  const { userLoggedIn, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    try {
      await doSignInWithEmailAndPassword(email, password);
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

  if (currentUser) {
    return <Navigate to="/Home" />;
  }

  return (
    <div>
      <img src="../assets/bitsore3.png" height="90px"/>
      <div className="Authbox">
        <h2>Login to Bit-Store</h2>
        <form onSubmit={onSubmit}>
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
          <input className="submit" type="submit" name="Login" value="Login" disabled={isSigningIn} />
        </form>
        {errorMessage && <p>{errorMessage}</p>}
        <button onClick={onGoogleSignIn} disabled={isSigningIn}><img src="../assets/GoogleLogo.png" height="100px" width="100px"/>Sign in with Google</button>
      </div>
      <p></p>
      <div className="linkbox">
        <h5>New to Bit-Store? <Link to="/Signup"><p>Create an Account</p></Link></h5>
      </div>
    </div>
  );
}

export default Login;