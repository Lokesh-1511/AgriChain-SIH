import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/VerificationComplete.module.css';

const VerificationComplete = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Auto-redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.completePage}>
      <div className={styles.completeContainer}>
        <div className={styles.completeCard}>
          <div className={styles.successIcon}>
            <div className={styles.checkmark}>
              <svg viewBox="0 0 52 52" className={styles.checkmarkSvg}>
                <circle
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                  className={styles.checkmarkCircle}
                />
                <path
                  fill="none"
                  d="m14,27 l8,8 l16,-16"
                  className={styles.checkmarkCheck}
                />
              </svg>
            </div>
          </div>
          
          <div className={styles.completeContent}>
            <h1 className={styles.completeTitle}>
              Verification Successful!
            </h1>
            <p className={styles.completeMessage}>
              Your Aadhaar has been successfully verified. Your AgriChain account 
              is now fully activated and secure.
            </p>
            
            <div className={styles.benefitsList}>
              <div className={styles.benefit}>
                <span className={styles.benefitIcon}>✓</span>
                <span>Secure transactions with verified identity</span>
              </div>
              <div className={styles.benefit}>
                <span className={styles.benefitIcon}>✓</span>
                <span>Access to premium AgriChain features</span>
              </div>
              <div className={styles.benefit}>
                <span className={styles.benefitIcon}>✓</span>
                <span>Enhanced trust with trading partners</span>
              </div>
            </div>
          </div>
          
          <div className={styles.completeActions}>
            <Link to="/" className={styles.primaryButton}>
              Go to Dashboard
            </Link>
            <Link to="/profile" className={styles.secondaryButton}>
              View Profile
            </Link>
          </div>
          
          <div className={styles.completeFooter}>
            <p className={styles.autoRedirect}>
              You will be automatically redirected to the dashboard in 10 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationComplete;