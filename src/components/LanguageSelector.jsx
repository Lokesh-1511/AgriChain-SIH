import React from 'react';

// Placeholder component for language selection
const LanguageSelector = () => {
  return (
    <select 
      defaultValue="en" 
      style={{ 
        padding: '0.25rem 0.5rem', 
        borderRadius: '3px', 
        border: '1px solid #ccc',
        backgroundColor: 'white'
      }}
    >
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
      <option value="te">తెలుగు</option>
    </select>
  );
};

export default LanguageSelector;