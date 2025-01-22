import React, { useState } from 'react';
import { doCreateUserwithEmailAndPassword } from './firebase/auth';
import { useAuth } from './contexts/authContext';

function Signup() {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
        </div>
    );
}

export default Signup;