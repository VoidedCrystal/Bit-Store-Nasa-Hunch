//eslint-disable-next-line
import React from 'react';
//eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './Auth.css';

function Upload() {
  const [user, getUsername] = useState('');
  const [Password, getPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    

    fetch('http://127.0.0.1:8000/api/documents/', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setDescription('');
        setFile(null);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };
    return (
        <div>
            <img src="../Assets/bitsore3.png" height="90px"/>
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
