import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';
import GlowingButton from '../components/GlowingButton';
import './Auth.css';

const Login = ({ setAuth, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.access_token);
      
      const meRes = await api.get('/auth/me');
      setUser(meRes.data);
      setAuth(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <GlassCard className="auth-card">
        <h2 className="glow-text blink-cursor title">ACCESS_TERMINAL</h2>
        <p className="subtitle">Authenticate to proceed</p>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleLogin}>
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
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="link">Forgot Password?</a>
          </div>

          <GlowingButton type="submit" fullWidth className="mt-4">
            Initialize Session
          </GlowingButton>
        </form>

        <div className="auth-footer">
          <span>Unregistered entity? </span>
          <Link to="/register" className="link glow-text">Register here</Link>
          <br/>
          <a href="#" className="link-stub">Resend verification email</a>
        </div>
      </GlassCard>
    </div>
  );
};

export default Login;
