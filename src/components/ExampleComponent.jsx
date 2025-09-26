// Example Component using the new Design System
import React from 'react';
import ui from '../styles/ui.module.css';

const ExampleComponent = () => {
  return (
    <div className={`${ui.container} ${ui.containerLg}`}>
      <h1 className={ui.text3xl}>Welcome to AgriChain</h1>
      
      {/* Grid Layout */}
      <div className={`${ui.grid} ${ui.gridAutoFit} ${ui.gap4}`}>
        {/* Card Example */}
        <div className={`${ui.card} ${ui.cardInteractive} animate-fade-in-up`}>
          <h3 className={ui.textXl}>Product Card</h3>
          <p className={ui.textSecondary}>This is an example of using our design system</p>
          
          {/* Buttons */}
          <div className={`${ui.flexBetween} ${ui.gap2}`}>
            <button className={`${ui.btnBase} ${ui.btnPrimary} ${ui.btnMd}`}>
              Primary Action
            </button>
            <button className={`${ui.btnBase} ${ui.btnGhost} ${ui.btnMd}`}>
              Secondary
            </button>
          </div>
        </div>

        {/* Another Card */}
        <div className={`${ui.card} ${ui.cardGradient} animate-fade-in-up animate-delay-200`}>
          <h3 className={ui.textXl}>Gradient Card</h3>
          <p>Using gradient background with delay animation</p>
          
          {/* Badge */}
          <span className={`${ui.badge} ${ui.badgeSuccess}`}>
            Active
          </span>
        </div>

        {/* Skeleton Loading Example */}
        <div className={`${ui.card} ${ui.cardFlat}`}>
          <div className={`${ui.skeleton} ${ui.skeletonTitle}`}></div>
          <div className={`${ui.skeleton} ${ui.skeletonParagraph}`}></div>
          <div className={`${ui.skeleton} ${ui.skeletonParagraph}`}></div>
          <div className={`${ui.skeleton} ${ui.skeletonButton}`}></div>
        </div>
      </div>

      {/* Form Example */}
      <div className={`${ui.card} ${ui.cardCompact}`}>
        <h2 className={ui.text2xl}>Form Elements</h2>
        
        <div className={ui.formGroup}>
          <label className={ui.label} htmlFor="example-input">
            Example Input
          </label>
          <input 
            id="example-input"
            className={`${ui.input} ${ui.focusRingPrimary}`}
            placeholder="Enter text..."
          />
        </div>

        <div className={`${ui.flexBetween} ${ui.gap2}`}>
          <button className={`${ui.btnBase} ${ui.btnSuccess} ${ui.btnMd} ${ui.hoverLift}`}>
            Submit
          </button>
          <button className={`${ui.btnBase} ${ui.btnSecondary} ${ui.btnMd}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExampleComponent;