import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const backendResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
        token: response.credential,
      });
      const { token, role } = backendResponse.data;

      localStorage.setItem('token', token);

      if (role === 'hod') {
        navigate('/hod');
      } else if (role === 'teamlead') {
        navigate('/teamlead');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.log(error.message)
      setError('Failed to log in with Google');
    }
  };

  const handleGoogleLoginFailure = (err) => {
    setError('Google login failed', err);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center min-h-[93vh] bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              scope="openid profile email"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

