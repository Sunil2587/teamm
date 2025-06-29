import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationMsg, setVerificationMsg] = useState('');

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') {
      setEmailVerified(false);
      setVerificationMsg('');
    }
  };

  // Simulate email verification (replace with real API in production)
  const handleVerifyEmail = async () => {
    setVerifying(true);
    setVerificationMsg('');
    setTimeout(() => {
      if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(signupData.email)) {
        setEmailVerified(true);
        setVerificationMsg('✅ Email verified!');
      } else {
        setEmailVerified(false);
        setVerificationMsg('❌ Invalid email address.');
      }
      setVerifying(false);
    }, 1200);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.username,
          password: loginData.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful!');
        window.location.reload();
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Server error');
    }
    setLoading(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) {
      setVerificationMsg('Please verify your email before signing up.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Signup successful! Please login.');
        setActiveTab('login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      alert('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="login-bg-image">
      <div className="auth-container">
        <div className="auth-box">
          <div className="tabs" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <input
              type="radio"
              id="login-tab"
              name="tab"
              checked={activeTab === 'login'}
              onChange={() => handleTabChange('login')}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="login-tab"
              className={activeTab === 'login' ? 'tab-label active' : 'tab-label'}
              style={{
                padding: '10px 32px',
                cursor: 'pointer',
                borderBottom: activeTab === 'login' ? '2px solid #1976d2' : '2px solid transparent',
                fontWeight: activeTab === 'login' ? 700 : 400,
                color: activeTab === 'login' ? '#1976d2' : '#555',
                background: 'none'
              }}
            >
              Login
            </label>
            <input
              type="radio"
              id="signup-tab"
              name="tab"
              checked={activeTab === 'signup'}
              onChange={() => handleTabChange('signup')}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="signup-tab"
              className={activeTab === 'signup' ? 'tab-label active' : 'tab-label'}
              style={{
                padding: '10px 32px',
                cursor: 'pointer',
                borderBottom: activeTab === 'signup' ? '2px solid #1976d2' : '2px solid transparent',
                fontWeight: activeTab === 'signup' ? 700 : 400,
                color: activeTab === 'signup' ? '#1976d2' : '#555',
                background: 'none'
              }}
            >
              Sign Up
            </label>
          </div>
          <div
            className={`tab-content login-content${activeTab === 'login' ? ' active' : ''}`}
            style={{
              display: activeTab === 'login' ? 'block' : 'none',
              padding: '0 24px'
            }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>LOGIN</h2>
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                name="username"
                placeholder="Username or Email"
                value={loginData.username}
                onChange={handleLoginChange}
                required
                style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: 12,
                  borderRadius: 6,
                  background: '#1976d2',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 17,
                  border: 'none',
                  marginTop: 8
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <button
                type="button"
                className="forgot"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1976d2',
                  cursor: 'pointer',
                  padding: 0,
                  marginTop: 8,
                  textAlign: 'left'
                }}
                onClick={() => alert('Forgot password feature coming soon!')}
              >
                Forgot password?
              </button>
            </form>
          </div>
          <div
            className={`tab-content signup-content${activeTab === 'signup' ? ' active' : ''}`}
            style={{
              display: activeTab === 'signup' ? 'block' : 'none',
              padding: '0 24px'
            }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>SIGN UP</h2>
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={signupData.name}
                onChange={handleSignupChange}
                required
                style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
              />
              <div className="email-verify-row" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16, margin: 0 }}
                  disabled={emailVerified}
                />
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={verifying || !signupData.email || emailVerified}
                  style={{
                    height: 40,
                    padding: '0 18px',
                    borderRadius: 7,
                    fontSize: 16,
                    fontWeight: 700,
                    background: emailVerified ? '#43a047' : '#1976d2',
                    color: '#fff',
                    border: 'none',
                    cursor: verifying || emailVerified ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {emailVerified ? 'Verified' : verifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
              {verificationMsg && (
                <div className="email-error" style={{ color: emailVerified ? '#43a047' : '#b71c1c', fontSize: 14, marginTop: -8, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {emailVerified ? (
                    <span style={{ color: '#43a047' }}>✔</span>
                  ) : (
                    <span style={{ color: '#b71c1c' }}>✖</span>
                  )}
                  {verificationMsg.replace(/^✅ |^❌ /, '')}
                </div>
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
                style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
              />
              <button
                type="submit"
                disabled={loading || !emailVerified}
                style={{
                  padding: 12,
                  borderRadius: 6,
                  background: emailVerified ? '#1976d2' : '#aaa',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 17,
                  border: 'none',
                  marginTop: 8,
                  cursor: loading || !emailVerified ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
