import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    let cancelled = false;

    api
      .get('/auth/verify-email', { params: { token } })
      .then((res) => {
        if (!cancelled) {
          setStatus('success');
          setMessage(res.data.message || 'Email verified successfully!');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus('error');
          const detail = err.response?.data?.detail;
          setMessage(
            typeof detail === 'string'
              ? detail
              : 'Verification failed. The link may be invalid or expired.'
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-ivory px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl font-bold text-charcoal">
              Inba<span className="text-sage">Naturals</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-serif text-charcoal">Email Verification</h1>
        </div>

        <Card padding={true}>
          <div className="flex flex-col items-center text-center py-6 space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 size={48} className="text-sage animate-spin" />
                <p className="text-charcoal-light">Verifying your email…</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle size={48} className="text-green-600" />
                <h2 className="text-xl font-serif text-charcoal">Verified!</h2>
                <p className="text-charcoal-light">{message}</p>
                <Link to="/login">
                  <Button className="mt-2">Continue to Login</Button>
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle size={48} className="text-red-500" />
                <h2 className="text-xl font-serif text-charcoal">Verification Failed</h2>
                <p className="text-charcoal-light">{message}</p>
                <div className="flex gap-3 mt-2">
                  <Link to="/register">
                    <Button variant="secondary">Register Again</Button>
                  </Link>
                  <Link to="/">
                    <Button>Back to Home</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
