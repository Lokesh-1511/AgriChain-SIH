import React from 'react';
import styles from '../styles/ProgressRing.module.css';

const ProgressRing = ({ 
  value, 
  max = 100, 
  size = 120, 
  strokeWidth = 8, 
  color = '#16a34a',
  backgroundColor = '#e5e7eb',
  showValue = true,
  label = '',
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={`${styles.progressRing} ${className}`}>
      <svg
        width={size}
        height={size}
        className={styles.ring}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={styles.progressCircle}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      
      {showValue && (
        <div className={styles.centerContent}>
          <span className={styles.value}>{Math.round(value)}</span>
          {label && <span className={styles.label}>{label}</span>}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;