import React, { useState } from 'react';
import styles from './SchemeCard.module.css';

const SchemeCard = ({ scheme, onApply, farmerData }) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onApply(scheme.id);
    setIsApplying(false);
  };

  const getEligibilityColor = (status) => {
    switch (status) {
      case 'high':
        return styles.eligibilityHigh;
      case 'medium':
        return styles.eligibilityMedium;
      case 'low':
        return styles.eligibilityLow;
      default:
        return styles.eligibilityDefault;
    }
  };

  const getEligibilityText = (status) => {
    switch (status) {
      case 'high':
        return 'High Eligibility';
      case 'medium':
        return 'Medium Eligibility';
      case 'low':
        return 'Low Eligibility';
      default:
        return 'Check Eligibility';
    }
  };

  return (
    <div className={styles.schemeCard}>
      <div className={styles.schemeHeader}>
        <div className={styles.schemeIcon}>
          <span>{scheme.icon}</span>
        </div>
        <div className={`${styles.eligibilityBadge} ${getEligibilityColor(scheme.eligibility)}`}>
          {getEligibilityText(scheme.eligibility)}
        </div>
      </div>

      <div className={styles.schemeContent}>
        <h3 className={styles.schemeTitle}>{scheme.title}</h3>
        <p className={styles.schemeDescription}>{scheme.description}</p>

        <div className={styles.schemeDetails}>
          <div className={styles.benefitAmount}>
            <span className={styles.benefitLabel}>Max Benefit</span>
            <span className={styles.benefitValue}>₹{scheme.maxBenefit.toLocaleString()}</span>
          </div>
          
          <div className={styles.schemeMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Category:</span>
              <span className={styles.metaValue}>{scheme.category}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Deadline:</span>
              <span className={styles.metaValue}>{scheme.deadline}</span>
            </div>
          </div>
        </div>

        <div className={styles.aiInsights}>
          <h4 className={styles.aiTitle}>🤖 AI Analysis</h4>
          <ul className={styles.aiReasons}>
            {scheme.aiReasons.map((reason, index) => (
              <li key={index} className={styles.aiReason}>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.schemeActions}>
        <button
          className={styles.applyButton}
          onClick={handleApply}
          disabled={isApplying || scheme.status === 'applied'}
        >
          {isApplying ? 'Applying...' : scheme.status === 'applied' ? 'Applied' : 'Apply Now'}
        </button>
        <button className={styles.learnMoreButton}>
          Learn More
        </button>
      </div>
    </div>
  );
};

export default SchemeCard;