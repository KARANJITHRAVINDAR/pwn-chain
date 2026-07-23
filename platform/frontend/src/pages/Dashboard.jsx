import React, { useEffect, useState } from 'react';
import { User, LogOut, CheckCircle, Lock, Server, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';
import GlowingButton from '../components/GlowingButton';
import './Dashboard.css';

const Dashboard = ({ user, setAuth, setUser }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hintMsg, setHintMsg] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get('/session/current');
        setSession(res.data);
      } catch (err) {
        setSession(null);
      }
    };
    fetchSession();
    const interval = setInterval(fetchSession, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
  };

  const startSession = async (mode) => {
    try {
      const res = await api.post('/session/start', { mode });
      // Fetch new session state
      const sRes = await api.get('/session/current');
      setSession(sRes.data);
      // Open lab url in new tab
      window.open(res.data.lab_url, '_blank');
    } catch (err) {
      alert("Error starting session");
    }
  };

  const requestHint = async () => {
    if (!session) return;
    try {
      const res = await api.post('/hint', {
        session_id: session.session_id,
        stage: session.max_unlocked_stage
      });
      setHintMsg(`Hint: ${res.data.hint_text} (Remaining: ${res.data.hints_remaining})`);
      setTimeout(() => setHintMsg(null), 10000);
      
      // Update session points
      const sRes = await api.get('/session/current');
      setSession(sRes.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Could not fetch hint");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Nav */}
      <nav className="top-nav">
        <div className="brand glow-text">PWNCHAIN <span className="blink-cursor"></span></div>
        <div className="profile-menu">
          <div className="profile-icon" onClick={() => setProfileOpen(!profileOpen)}>
            <User size={24} color="#00ff88" />
          </div>
          {profileOpen && (
            <div className="profile-dropdown glass-panel">
              <div className="dropdown-item" onClick={() => navigate('/profile')}>View Profile</div>
              <div className="dropdown-item" onClick={handleLogout}><LogOut size={16}/> Logout</div>
            </div>
          )}
        </div>
      </nav>

      <div className="dashboard-body">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <GlassCard className="sidebar-section points-section">
            <h3 className="section-title">TOTAL POINTS</h3>
            <div className="points-display glow-text">
              {session ? session.total_points : 0}
            </div>
          </GlassCard>

          <GlassCard className="sidebar-section progress-section">
            <h3 className="section-title">LAB PROGRESS</h3>
            {session ? (
              <div className="progress-tracker">
                <div className="session-mode">Active: {session.mode.toUpperCase()}</div>
                {[1, 2, 3, 4].map(stage => {
                  const unlocked = stage <= session.max_unlocked_stage;
                  const completed = stage < session.max_unlocked_stage;
                  return (
                    <div key={stage} className={`stage-node ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}>
                      <div className="node-icon">
                        {completed ? <CheckCircle size={20} /> : unlocked ? <div className="current-dot"></div> : <Lock size={16} />}
                      </div>
                      <div className="node-label">Stage {stage}</div>
                    </div>
                  );
                })}
                
                {session.max_unlocked_stage <= 4 && (
                  <div className="hint-container">
                    <GlowingButton onClick={requestHint} fullWidth className="hint-btn">
                      Get Hint (-10pts)
                    </GlowingButton>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-session text-dim">No active session. Select a mode to begin.</div>
            )}
          </GlassCard>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {hintMsg && (
            <div className="hint-toast glass-panel glow-text">
              {hintMsg}
            </div>
          )}
          
          <div className="mode-cards">
            <GlassCard className="mode-card story-mode">
              <div className="mode-icon"><BookOpen size={48} color="#00ff88"/></div>
              <h2 className="glow-text">STORY MODE</h2>
              <p className="text-dim mt-4 mb-8">Follow the narrative. Exploit the vulnerabilities in a sequential, guided experience to uncover the truth.</p>
              <GlowingButton onClick={() => startSession('story')} fullWidth>
                Initiate Sequence
              </GlowingButton>
            </GlassCard>

            <GlassCard className="mode-card real-mode">
              <div className="mode-icon"><Server size={48} color="#00ff88"/></div>
              <h2 className="glow-text">REALTIME MODE</h2>
              <p className="text-dim mt-4 mb-8">No guidance. Pure exploitation. Race against time in a realistic, unassisted penetration test scenario.</p>
              <GlowingButton onClick={() => startSession('realtime')} fullWidth>
                Initialize Target
              </GlowingButton>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
