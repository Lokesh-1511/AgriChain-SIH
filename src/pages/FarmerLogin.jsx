import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import FormInput from '../components/FormInput';
import styles from '../styles/FarmerLogin.module.css';

const FarmerLogin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: 'farmer@test.com',
    password: 'password123'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }
    
    if (!formData.password.trim()) {
      newErrors.password = t('validation.required');
    }
    
    return newErrors;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create test user if it doesn't exist
      let storedUser = localStorage.getItem('agrichain-user');
      if (!storedUser && formData.email === 'farmer@test.com') {
        const testUser = {
          name: 'Test Farmer',
          email: 'farmer@test.com',
          password: 'password123',
          phone: '9876543210',
          address: '123 Farm Street',
          userType: 'farmer',
          id: 'test-farmer-1',
          registeredAt: new Date().toISOString()
        };
        localStorage.setItem('agrichain-user', JSON.stringify(testUser));
        storedUser = JSON.stringify(testUser);
      }
      
      // Mock authentication - in real app, this would be an API call
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.email === formData.email && userData.password === formData.password && userData.userType === 'farmer') {
          // Successful login - store as currentUser for dashboard access
          localStorage.setItem('agrichain-auth-token', 'mock-jwt-token');
          localStorage.setItem('currentUser', storedUser);
          navigate('/farmer/dashboard');
        } else {
          setErrors({ general: 'Invalid email or password' });
        }
      } else {
        setErrors({ general: 'Account not found. Please register first.' });
      }
      
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>
              {t('nav.farmer')} {t('auth.login')}
            </h1>
            <p className={styles.loginSubtitle}>
              {t('auth.loginToAccount')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {errors.general && (
              <div className={styles.errorAlert}>
                {errors.general}
              </div>
            )}

            <FormInput
              label={t('auth.email')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email address"
              required
            />

            <FormInput
              label={t('auth.password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />

            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Logging in...' : t('auth.login')}
              </button>
            </div>
          </form>

          <div className={styles.loginFooter}>
            <p>
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/farmer/register" className={styles.registerLink}>
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerLogin;