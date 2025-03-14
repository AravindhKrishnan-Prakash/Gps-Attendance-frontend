import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginStyle.css';

const StudLogin = ({ login }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:8000/api/accounts/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      login(data.token, 'student'); 
      localStorage.setItem('rollNumber', username);  // Save roll number in localStorage
      navigate('/student');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="form-container">
      <h1>Student Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Roll No:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="LoginButton" type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Don't have an account? <a href="/student/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default StudLogin;
