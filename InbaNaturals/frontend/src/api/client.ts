import axios from 'axios';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach Bearer token and PWNDORA session header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || getCookie('token') || getCookie('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Preserve PWNDORA session identifier from URL or storage
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session') || localStorage.getItem('pwndora_session_id');
  if (sessionId) {
    localStorage.setItem('pwndora_session_id', sessionId);
    config.headers['x-session'] = sessionId;
  }

  return config;
});

// Response: on 401, clear token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      document.cookie = 'token=; Max-Age=0; path=/';
    }
    return Promise.reject(err);
  }
);

export default api;
