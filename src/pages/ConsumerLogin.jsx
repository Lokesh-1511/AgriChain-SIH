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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create test user if it doesn't exist
      let storedConsumers = JSON.parse(localStorage.getItem('consumers') || '[]');
      if (storedConsumers.length === 0 && formData.email === 'consumer@test.com') {
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
        storedConsumers = [testConsumer];
        localStorage.setItem('consumers', JSON.stringify(storedConsumers));
      }
      
      // Find matching consumer
      const consumer = storedConsumers.find(c => 
        c.email.toLowerCase() === formData.email.toLowerCase() && 
        c.password === formData.password
      );
      
      if (consumer) {
        // Store current consumer session
        localStorage.setItem('currentUser', JSON.stringify({
          ...consumer,
          userType: 'consumer'
        }));
        
        alert('Login successful! Welcome back, ' + consumer.name);
        navigate('/consumer'); // Redirect to consumer dashboard
      } else {
        setErrors({ 
          email: 'Invalid email or password', 
          password: 'Invalid email or password' 
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
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className={styles.loginFooter}>
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