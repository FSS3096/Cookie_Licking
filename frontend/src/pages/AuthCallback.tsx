import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const { handleGitHubCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      handleGitHubCallback(token);
      navigate('/');
    } else if (error) {
      navigate('/login', { state: { error } });
    } else {
      navigate('/login');
    }
  }, [handleGitHubCallback, navigate, location]);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Processing...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback;