import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './LoOhm.png';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();  // Initialize navigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { username, password, email };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred during login.');
    }
  };

  // Function to navigate to the sign-up page
  const handleSignupClick = () => {
    navigate('/signup');  // Navigate to the /signup route
  };

  return (
    <div className="form-container">
      <h1>Welcome to Lo-Ohm!</h1>
      <img src={logo} className="App-logo" alt="logo" />

      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>



        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="button">Login</button>
      </form>

      {message && <p>{message}</p>}

      <p className="signup-link">
        Click <span onClick={handleSignupClick}>here</span> to sign up!
      </p>
    </div>
  );
}

export default Login;
