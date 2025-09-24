import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import FormInput from '../components/FormInput';
import styles from '../styles/VerifyAadhaar.module.css';

const VerifyAadhaar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [step, setStep] = useState(1); // 1: Aadhaar input, 2: OTP verification
  const [formData, setFormData] = useState({
    aadhaar: '',
    otp: ['', '', '', '', '', '']
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateAadhaar = () => {
    const newErrors = {};
    
    // Aadhaar validation (12 digits)
    if (!formData.aadhaar.trim()) {
      newErrors.aadhaar = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(formData.aadhaar.replace(/\s/g, ''))) {
      newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
    }
    
    return newErrors;
  };

  const validateOTP = () => {
    const newErrors = {};
    const otpString = formData.otp.join('');
    
    if (otpString.length !== 6) {
      newErrors.otp = 'Please enter the complete 6-digit OTP';
    } else if (!/^\d{6}$/.test(otpString)) {
      newErrors.otp = 'OTP should contain only numbers';
    }
    
    return newErrors;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    const newErrors = validateAadhaar();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    
    try {
      // Simulate API call delay (1 second as requested)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful OTP send
      setStep(2);
      alert('OTP sent successfully to your registered mobile number!');
    } catch (error) {
      console.error('Send OTP error:', error);
      setErrors({ aadhaar: 'Failed to send OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    const newErrors = validateOTP();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    
    try {
      // Simulate API verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock OTP verification (accept any 6-digit OTP for demo)
      const otpString = formData.otp.join('');
      
      if (otpString === '123456') {
        // Demo: Accept 123456 as valid OTP
        navigate('/verification-complete');
      } else {
        // For demo, we'll accept any 6-digit OTP
        navigate('/verification-complete');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setErrors({ otp: 'Invalid OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAadhaarChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Only allow digits
    
    // Format as XXXX XXXX XXXX for better readability
    if (value.length > 0) {
      value = value.match(/.{1,4}/g)?.join(' ') || value;
    }
    
    // Limit to 12 digits (plus spaces)
    if (value.replace(/\s/g, '').length <= 12) {
      setFormData(prev => ({
        ...prev,
        aadhaar: value
      }));
      
      if (errors.aadhaar) {
        setErrors(prev => ({ ...prev, aadhaar: '' }));
      }
    }
  };

  const handleOTPChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    
    setFormData(prev => ({
      ...prev,
      otp: newOtp
    }));
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
    
    // Clear OTP error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const handleOTPKeyDown = (index, e) => {
    // Handle backspace to focus previous input
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...formData.otp];
        newOtp[index - 1] = '';
        setFormData(prev => ({ ...prev, otp: newOtp }));
      }
    }
  };

  const maskAadhaar = (aadhaar) => {
    const cleaned = aadhaar.replace(/\s/g, '');
    if (cleaned.length >= 4) {
      return 'XXXX XXXX ' + cleaned.slice(-4);
    }
    return aadhaar;
  };

  return (
    <div className={styles.verifyPage}>
      <div className={styles.verifyContainer}>
        <div className={styles.verifyCard}>
          <div className={styles.verifyHeader}>
            <h1 className={styles.verifyTitle}>
              {step === 1 ? 'Verify Aadhaar' : 'Enter OTP'}
            </h1>
            <p className={styles.verifySubtitle}>
              {step === 1 
                ? 'Secure your AgriChain account with Aadhaar verification'
                : `OTP sent to mobile linked with ${maskAadhaar(formData.aadhaar)}`
              }
            </p>
          </div>
          
          {step === 1 ? (
            <form className={styles.verifyForm} onSubmit={handleSendOTP}>
              <FormInput
                label="Aadhaar Number"
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleAadhaarChange}
                error={errors.aadhaar}
                placeholder="Enter your 12-digit Aadhaar number"
                maxLength={14} // 12 digits + 2 spaces
                required
              />
              
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form className={styles.verifyForm} onSubmit={handleVerifyOTP}>
              <div className={styles.otpSection}>
                <label className={styles.otpLabel}>
                  Enter 6-digit OTP
                </label>
                <div className={styles.otpInputs}>
                  {formData.otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`otp-${index}`}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className={`${styles.otpInput} ${errors.otp ? styles.otpInputError : ''}`}
                      maxLength={1}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                {errors.otp && (
                  <span className={styles.errorMessage}>{errors.otp}</span>
                )}
              </div>
              
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <button
                type="button"
                className={styles.resendButton}
                onClick={() => {
                  setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
                  alert('OTP resent successfully!');
                }}
              >
                Resend OTP
              </button>
            </form>
          )}
          
          <div className={styles.verifyFooter}>
            <p className={styles.securityNote}>
              🔒 Your Aadhaar details are secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAadhaar;