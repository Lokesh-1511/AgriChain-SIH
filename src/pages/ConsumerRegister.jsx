import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import FormInput from '../components/FormInput';
import styles from '../styles/ConsumerRegister.module.css';

const ConsumerRegister = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.required');
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = t('validation.required');
    }
    
    if (!formData.password.trim()) {
      newErrors.password = t('validation.required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('validation.minLength').replace('{min}', '6');
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('validation.required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordMismatch');
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
      
      // Store user data in localStorage (in real app, password should be hashed)
      const userData = {
        ...formData,
        userType: 'consumer',
        id: Date.now().toString(),
        registeredAt: new Date().toISOString()
      };
      
      // For demo purposes, keep password (in real app, hash it first)
      const { confirmPassword, ...userDataToStore } = userData;
      
      localStorage.setItem('agrichain-user', JSON.stringify(userDataToStore));
      localStorage.setItem('agrichain-pending-verification', 'true');
      
      // Navigate to verification
      navigate('/consumer/verify');
      
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <div className={styles.registerHeader}>
            <h1 className={styles.registerTitle}>
              {t('nav.consumer')} {t('auth.register')}
            </h1>
            <p className={styles.registerSubtitle}>
              {t('auth.createAccount')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <FormInput
              label={t('auth.name')}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your full name"
              required
            />

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
              label={t('auth.phone')}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="Enter your phone number"
              maxLength="10"
              required
            />

            <FormInput
              label={t('auth.address')}
              type="textarea"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="Enter your complete address"
              rows="3"
              required
            />

            <FormInput
              label={t('auth.password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Create a password"
              minLength="6"
              required
            />

            <FormInput
              label={t('auth.confirmPassword')}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Creating Account...' : t('auth.createAccount')}
            </button>
          </form>

          <div className={styles.registerFooter}>
            <p>
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/consumer/login" className={styles.loginLink}>
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerRegister;