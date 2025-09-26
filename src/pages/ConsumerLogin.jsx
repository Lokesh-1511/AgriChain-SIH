import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import FormInput from '../components/FormInput';
import styles from '../styles/ConsumerLogin.module.css';

const ConsumerLogin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    email: 'consumer@test.com',
    password: 'password123',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    
    try {
      console.log('Consumer login attempt:', { email: formData.email, password: formData.password });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle test consumer login
      if (formData.email === 'consumer@test.com' && formData.password === 'password123') {
        const testConsumer = {
          name: 'Test Consumer',
          email: 'consumer@test.com',
          password: 'password123',
          phone: '9876543210',
          address: '123 Consumer Street',
          userType: 'consumer',
          id: 'test-consumer-1',
          registeredAt: new Date().toISOString()
        };
        
        // Store the consumer user data
        localStorage.setItem('agrichain-user', JSON.stringify(testConsumer));
        localStorage.setItem('agrichain-auth-token', 'mock-consumer-jwt-token');
        localStorage.setItem('currentUser', JSON.stringify(testConsumer));
        
        console.log('Consumer login successful:', testConsumer);
        alert('Login successful! Welcome back, Test Consumer');
        navigate('/consumer/dashboard');
        setIsLoading(false);
        return;
      }
      
      // Check for existing registered user
      const storedUser = localStorage.getItem('agrichain-user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.email === formData.email && userData.password === formData.password && userData.userType === 'consumer') {
          // Successful login - store as currentUser for dashboard access
          localStorage.setItem('agrichain-auth-token', 'mock-jwt-token');
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          alert('Login successful! Welcome back, ' + userData.name);
          navigate('/consumer/dashboard');
        } else {
          setErrors({ 
            email: 'Invalid email, password, or account type', 
            password: 'Invalid email, password, or account type' 
          });
        }
      } else {
        setErrors({ 
          email: 'Invalid email or password. Use consumer@test.com / password123 for demo.',
          password: 'Invalid email or password. Use consumer@test.com / password123 for demo.'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ email: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>Consumer Login</h1>
            <p className={styles.loginSubtitle}>
              Access your AgriChain consumer account
            </p>
          </div>
          
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email address"
              required
            />
            
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />
            
            <div className={styles.formActions}>
              <div className={styles.forgotPasswordLink}>
                <Link to="/consumer/forgot-password" className={styles.forgotLink}>
                  Forgot Password?
                </Link>
              </div>
              
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className={styles.loginFooter}>
            <div className={styles.debugSection}>
              <p><strong>Debug Info:</strong></p>
              <p>Email: {formData.email}</p>
              <p>Password: {formData.password}</p>
              <button 
                type="button" 
                onClick={() => {
                  console.log('Current form data:', formData);
                  console.log('LocalStorage:', {
                    user: localStorage.getItem('agrichain-user'),
                    currentUser: localStorage.getItem('currentUser'),
                    token: localStorage.getItem('agrichain-auth-token')
                  });
                }}
                className={styles.debugButton}
              >
                Debug Console
              </button>
              <button 
                type="button" 
                onClick={() => {
                  localStorage.clear();
                  alert('LocalStorage cleared!');
                }}
                className={styles.debugButton}
              >
                Clear Storage
              </button>
            </div>
            <p>
              Don't have a consumer account?{' '}
              <Link to="/consumer/register" className={styles.registerLink}>
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerLogin;