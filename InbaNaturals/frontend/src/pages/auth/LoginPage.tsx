import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { User, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(username, password);
      showToast('Successfully logged in!', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      let errorMsg = 'Invalid credentials or unverified email.';
      if (err.response?.data?.detail) {
        errorMsg = typeof err.response.data.detail === 'string' 
          ? err.response.data.detail 
          : Array.isArray(err.response.data.detail) 
            ? err.response.data.detail[0]?.msg 
            : JSON.stringify(err.response.data.detail);
      }
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-ivory px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl font-bold text-charcoal">
              Inba<span className="text-sage">Naturals</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-serif text-charcoal">Welcome Back</h1>
          <p className="mt-2 text-charcoal-light">Sign in to your account</p>
        </div>

        <Card padding={true}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              icon={<User size={18} />}
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock size={18} />}
              disabled={loading}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-ivory-dark text-sage focus:ring-sage"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-charcoal">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-sage hover:text-sage-dark">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal-light">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-sage hover:text-sage-dark transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
