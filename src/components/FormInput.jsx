import React from 'react';
import styles from '../styles/FormInput.module.css';

const FormInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false, 
  disabled = false,
  name,
  maxLength,
  minLength,
  rows,
  ...props 
}) => {
  const inputId = `input-${name || Math.random().toString(36).substr(2, 9)}`;
  
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <InputComponent
        id={inputId}
        type={type === 'textarea' ? undefined : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        name={name}
        maxLength={maxLength}
        minLength={minLength}
        rows={rows}
        className={`${styles.input} ${error ? styles.inputError : ''} ${disabled ? styles.inputDisabled : ''}`}
        {...props}
      />
      
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;