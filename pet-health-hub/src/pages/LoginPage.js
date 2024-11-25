import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // "login" or "signup"
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setEmail('');
    setPassword('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');
      const { token } = await response.json();
      localStorage.setItem('token', token);

      const userResponse = await fetch('http://localhost:3001/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();
      setUser(userData);
      navigate('/profile');
    } catch (error) {
      console.error(error.message);
      alert('Invalid email or password.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Registration failed');
      alert('Registration successful! Please log in.');
      setActiveTab('login');
    } catch (error) {
      console.error(error.message);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <div className="login-image">
          <img
            src="/pet-group.jpg"
            alt="Group of pets including rabbit, cat, dog, ferret, and parrot"
            className="pets-image"
          />
        </div>
        <div className="login-form-container">
          <div className="login-header">
            <h1>Welcome!</h1>
            <p>Let's get started.</p>
          </div>
          <div className="login-tabs">
            <button
              className={activeTab === 'login' ? 'active' : ''}
              onClick={() => handleTabSwitch('login')}
            >
              Log In
            </button>
            <button
              className={activeTab === 'signup' ? 'active' : ''}
              onClick={() => handleTabSwitch('signup')}
            >
              Sign Up
            </button>
          </div>
          {activeTab === 'login' ? (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>
              <button type="submit" className="login-button">
                Log In
              </button>
            </form>
          ) : (
            <form className="signup-form" onSubmit={handleSignup}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>
              <button type="submit" className="login-button">
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
