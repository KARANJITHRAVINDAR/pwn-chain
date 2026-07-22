import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';
import GlowingButton from '../components/GlowingButton';
import './Auth.css';

const Register = ({ setAuth, setUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      // Register
      await api.post('/auth/register', {
        username,
        email,
        password
      });
      
      // Auto login after register
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.access_token);
      
      const meRes = await api.get('/auth/me');
      setUser(meRes.data);
      setAuth(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <GlassCard className="auth-card">
        <h2 className="glow-text blink-cursor title">CREATE_IDENTITY</h2>
        <p className="subtitle">Register new entity</p>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <GlowingButton type="submit" fullWidth className="mt-4">
            Initialize
          </GlowingButton>
        </form>

        <div className="auth-footer">
          <span>Existing entity? </span>
          <Link to="/login" className="link glow-text">Login here</Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default Register;
