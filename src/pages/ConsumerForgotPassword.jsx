import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import FormInput from '../components/FormInput';
import styles from '../styles/ConsumerForgotPassword.module.css';

const ConsumerForgotPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOTP, setCanResendOTP] = useState(false);

  // Simulate OTP timer
  React.useEffect(() => {
    let interval;
    if (step === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResendOTP(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const validateEmail = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    return newErrors;
  };

  const validateOTP = () => {
    const newErrors = {};
    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    return newErrors;
  };

  const validatePasswordReset = () => {
    const newErrors = {};
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateEmail();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sending OTP to:', formData.email);
      
      setIsSubmitting(false);
      setStep('otp');
      setOtpTimer(60);
      setCanResendOTP(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateOTP();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, accept any 6-digit OTP
      if (formData.otp === '123456') {
        setIsSubmitting(false);
        setStep('reset');
      } else {
        setIsSubmitting(false);
        setErrors({ otp: 'Invalid OTP. Try 123456 for demo.' });
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const formErrors = validatePasswordReset();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Password reset successful');
      
      setIsSubmitting(false);
      navigate('/consumer/login', { 
        state: { message: 'Password reset successful! Please login with your new password.' }
      });
    }
  };

  const handleResendOTP = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Resending OTP to:', formData.email);
    
    setIsSubmitting(false);
    setOtpTimer(60);
    setCanResendOTP(false);
  };

  const renderEmailStep = () => (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <div className={styles.stepIcon}>📧</div>
        <h2 className={styles.stepTitle}>Forgot Password</h2>
        <p className={styles.stepDescription}>
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className={styles.stepForm}>
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

        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
          </button>
          
          <Link to="/consumer/login" className={styles.backLink}>
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );

  const renderOTPStep = () => (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <div className={styles.stepIcon}>🔐</div>
        <h2 className={styles.stepTitle}>Enter OTP</h2>
        <p className={styles.stepDescription}>
          We've sent a 6-digit OTP to <strong>{formData.email}</strong>
        </p>
      </div>

      <form onSubmit={handleOTPSubmit} className={styles.stepForm}>
        <FormInput
          label="OTP Code"
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          error={errors.otp}
          placeholder="Enter 6-digit OTP"
          maxLength="6"
          required
        />

        <div className={styles.otpTimer}>
          {otpTimer > 0 ? (
            <p>Resend OTP in {otpTimer} seconds</p>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isSubmitting}
              className={styles.resendButton}
            >
              {isSubmitting ? 'Resending...' : 'Resend OTP'}
            </button>
          )}
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <button
            type="button"
            onClick={() => setStep('email')}
            className={styles.backLink}
          >
            Change Email
          </button>
        </div>
      </form>
    </div>
  );

  const renderResetStep = () => (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <div className={styles.stepIcon}>🔑</div>
        <h2 className={styles.stepTitle}>Reset Password</h2>
        <p className={styles.stepDescription}>
          Create a new password for your account.
        </p>
      </div>

      <form onSubmit={handlePasswordReset} className={styles.stepForm}>
        <FormInput
          label="New Password"
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          placeholder="Enter new password"
          required
        />

        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirm new password"
          required
        />

        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.forgotPasswordContainer}>
        <div className={styles.forgotPasswordCard}>
          <div className={styles.progressIndicator}>
            <div className={`${styles.progressStep} ${step === 'email' ? styles.active : step !== 'email' ? styles.completed : ''}`}>
              <span>1</span>
            </div>
            <div className={`${styles.progressLine} ${step !== 'email' ? styles.completed : ''}`}></div>
            <div className={`${styles.progressStep} ${step === 'otp' ? styles.active : step === 'reset' ? styles.completed : ''}`}>
              <span>2</span>
            </div>
            <div className={`${styles.progressLine} ${step === 'reset' ? styles.completed : ''}`}></div>
            <div className={`${styles.progressStep} ${step === 'reset' ? styles.active : ''}`}>
              <span>3</span>
            </div>
          </div>

          {step === 'email' && renderEmailStep()}
          {step === 'otp' && renderOTPStep()}
          {step === 'reset' && renderResetStep()}
        </div>
      </div>
    </div>
  );
};

export default ConsumerForgotPassword;