import React, { useState } from 'react';

function Signup() {
  const [username, setUsername] = useState('');  // State for username
  const [password, setPassword] = useState('');  // State for password
  const [email, setEmail] = useState('');        // State for email
  const [message, setMessage] = useState('');    // State for success/error message

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent page refresh
    const data = { username, password, email };  // Prepare form data

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),  // Convert form data to JSON
      });

      const result = await response.json();
      setMessage(result.message);  // Set the response message
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred during signup.');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // Update username state
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Update password state
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Update email state
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}  {/* Display success or error message */}
    </div>
  );
}

export default Signup;