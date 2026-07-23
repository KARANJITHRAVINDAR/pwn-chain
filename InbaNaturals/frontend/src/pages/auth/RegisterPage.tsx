import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { User, Lock, Mail, Type } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error when user types
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name || undefined
      });
      showToast('Registration successful! Check your email to verify.', 'success');
      navigate('/');
    } catch (err: any) {
      let errorMsg = 'An error occurred during registration.';
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
          <h1 className="mt-4 text-2xl font-serif text-charcoal">Create an Account</h1>
          <p className="mt-2 text-charcoal-light">Join us to shop natural products</p>
        </div>

        <Card padding={true}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="full_name"
              label="Full Name (Optional)"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              icon={<Type size={18} />}
              disabled={loading}
            />

            <Input
              id="username"
              label="Username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe123"
              icon={<User size={18} />}
              error={errors.username}
              disabled={loading}
            />
            
            <Input
              id="email"
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              icon={<Mail size={18} />}
              error={errors.email}
              disabled={loading}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.password}
              disabled={loading}
            />
            
            <Input
              id="confirm_password"
              label="Confirm Password"
              type="password"
              required
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.confirm_password}
              disabled={loading}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              loading={loading}
            >
              Create Account
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal-light">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-sage hover:text-sage-dark transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
