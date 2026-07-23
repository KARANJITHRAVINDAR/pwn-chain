import React, { useState } from 'react';
import { User, LogOut, ArrowLeft, Key, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';
import GlowingButton from '../components/GlowingButton';
import './Profile.css';

const Profile = ({ user, setAuth, setUser }) => {
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [usernameMsg, setUsernameMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
    navigate('/login');
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setUsernameMsg({ type: '', text: '' });
    if (!newUsername || newUsername === user?.username) return;

    try {
      const res = await api.put('/auth/profile/username', { new_username: newUsername });
      
      // Update the local token with the new one returned by the backend
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        // Refresh the user info by calling /auth/me or just updating local state
        setUser({ ...user, username: newUsername });
        setUsernameMsg({ type: 'success', text: 'Username updated successfully' });
      }
    } catch (err) {
      setUsernameMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to update username' });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'All password fields are required' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      const res = await api.put('/auth/profile/password', { 
        old_password: oldPassword, 
        new_password: newPassword 
      });
      setPasswordMsg({ type: 'success', text: res.data.message || 'Password updated successfully' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to update password' });
    }
  };

  return (
    <div className="profile-container">
      {/* Top Nav */}
      <nav className="top-nav">
        <div className="brand glow-text">PWNCHAIN <span className="blink-cursor"></span></div>
        <div className="nav-actions">
          <div className="nav-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} /> Back to Dashboard
          </div>
          <div className="nav-btn logout-btn" onClick={handleLogout}>
            <LogOut size={16}/> Logout
          </div>
        </div>
      </nav>

      <div className="profile-body">
        <div className="profile-grid">
          {/* User Info Section */}
          <GlassCard className="profile-card user-info-card">
            <div className="profile-avatar-container">
              <div className="profile-avatar glow-effect">
                <User size={64} color="#00ff88" />
              </div>
            </div>
            <h2 className="glow-text text-center mt-4">OPERATIVE PROFILE</h2>
            
            <div className="info-group mt-8">
              <label className="text-dim">OPERATIVE ID</label>
              <div className="info-value">#{user?.id?.toString().padStart(4, '0')}</div>
            </div>
            <div className="info-group mt-4">
              <label className="text-dim">EMAIL ADDRESS</label>
              <div className="info-value">{user?.email}</div>
            </div>
          </GlassCard>

          <div className="profile-settings">
            {/* Update Username Section */}
            <GlassCard className="profile-card settings-card">
              <h3 className="section-title"><User size={20} className="mr-2"/> Change Alias</h3>
              
              <form onSubmit={handleUpdateUsername} className="settings-form mt-4">
                <div className="form-group">
                  <label>NEW ALIAS (USERNAME)</label>
                  <input 
                    type="text" 
                    value={newUsername} 
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="hacker-input"
                    placeholder="Enter new username..."
                  />
                </div>
                
                {usernameMsg.text && (
                  <div className={`msg-text ${usernameMsg.type === 'error' ? 'text-red' : 'text-green'}`}>
                    {usernameMsg.text}
                  </div>
                )}
                
                <GlowingButton type="submit" className="mt-4" fullWidth disabled={!newUsername || newUsername === user?.username}>
                  <Save size={16} className="mr-2" /> Update Alias
                </GlowingButton>
              </form>
            </GlassCard>

            {/* Update Password Section */}
            <GlassCard className="profile-card settings-card mt-6">
              <h3 className="section-title"><Key size={20} className="mr-2"/> Security Credentials</h3>
              
              <form onSubmit={handleUpdatePassword} className="settings-form mt-4">
                <div className="form-group">
                  <label>CURRENT PASSWORD</label>
                  <input 
                    type="password" 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="hacker-input"
                    placeholder="Enter current password..."
                  />
                </div>
                
                <div className="form-group mt-4">
                  <label>NEW PASSWORD</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="hacker-input"
                    placeholder="Enter new password..."
                  />
                </div>
                
                <div className="form-group mt-4">
                  <label>CONFIRM NEW PASSWORD</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="hacker-input"
                    placeholder="Confirm new password..."
                  />
                </div>

                {passwordMsg.text && (
                  <div className={`msg-text ${passwordMsg.type === 'error' ? 'text-red' : 'text-green'}`}>
                    {passwordMsg.text}
                  </div>
                )}
                
                <GlowingButton type="submit" className="mt-4" fullWidth disabled={!oldPassword || !newPassword || !confirmPassword}>
                  <Save size={16} className="mr-2" /> Update Security Credentials
                </GlowingButton>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
