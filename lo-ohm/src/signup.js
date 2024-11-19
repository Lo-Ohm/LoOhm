import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './LoOhm.png';


function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { username, password, email };

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred during sign-up.');
    }
  };

  const handleReturnToLogin = () => {
    navigate('/');  // Navigate to the login page
  };

  return (
    <div className="form-container">
    {/* Return to login button */}
    <button className="return-button" onClick={handleReturnToLogin}>
      &#8592; Return to Login
    </button>


    <h1>Welcome to Lo-Ohm!</h1>
    <img src={logo} className="App-logo" alt="logo" />

      <h2>Sign Up</h2>
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
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
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

        <button type="submit" className="button">Sign Up</button>

        
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;
