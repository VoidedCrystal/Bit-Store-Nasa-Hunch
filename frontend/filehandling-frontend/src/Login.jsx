//eslint-disable-next-line
import React from 'react';
//eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './css/auth.css';

function Login() {
    return (
        <div>
            <img src="../assets/bitsore3.png" height="90px"/>
            <div class="Authbox">
                <h2>Login to Bit-Store</h2>
                <form action="Login.php" method="post">
                    <p><label for="User">"Username"</label></p>
                    <input type="text" name="User" required="true"/>
                    <p><label for="Password">Password</label></p>
                    <input type="password" name="Password" required="true"/>
                    <p></p>
                    <input class="submit" type="submit" name="Login" required="true" value="Login"/>
                </form>
            </div>
            <p></p>
            <div class="linkbox">
                <h5>New to Bit-Store? <a href="Sign_Up.html"><p>Create an Account</p></a></h5>
            </div>
        </div> 
    );
}

export default Login;
