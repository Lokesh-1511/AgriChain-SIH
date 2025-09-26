import React, { useState, useEffect } from 'react';
import styles from '../styles/SmartContractModal.module.css';

const SmartContractModal = ({ onComplete, onClose, orderTotal }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [txHash] = useState(`0x${Math.random().toString(16).substr(2, 40)}`);
  const [processing, setProcessing] = useState(true);

  const steps = [
    {
      id: 'initiate',
      title: 'Initiate Transaction',
      description: 'Creating smart contract and initializing payment',
      duration: 2000,
      icon: '🚀'
    },
    {
      id: 'escrow',
      title: 'Funds in Escrow',
      description: 'Payment secured in smart contract escrow',
      duration: 1500,
      icon: '🔒'
    },
    {
      id: 'farmer',
      title: 'Farmer Notification',
      description: 'Farmer notified and order processing started',
      duration: 1800,
      icon: '🌱'
    },
    {
      id: 'confirm',
      title: 'Delivery Confirmation',
      description: 'Order delivered and payment released to farmer',
      duration: 2200,
      icon: '✅'
    }
  ];

  useEffect(() => {
    if (!processing) return;

    const processSteps = async () => {
      for (let i = 0; i <= steps.length; i++) {
        if (i < steps.length) {
          setCurrentStep(i);
          await new Promise(resolve => setTimeout(resolve, steps[i].duration));
        } else {
          // All steps completed
          setProcessing(false);
        }
      }
    };

    processSteps();
  }, [processing]);

  const handleComplete = () => {
    onComplete(txHash);
  };

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep && processing) return 'active';
    if (index === currentStep && !processing) return 'completed';
    return 'pending';
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Smart Contract Execution</h2>
          <p>Blockchain Transaction in Progress</p>
        </div>

        <div className={styles.contractInfo}>
          <div className={styles.infoRow}>
            <span>Order Amount:</span>
            <span>₹{orderTotal.toLocaleString()}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Transaction Hash:</span>
            <span className={styles.txHash}>{txHash}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Network:</span>
            <span>AgriChain Testnet</span>
          </div>
        </div>

        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`${styles.step} ${styles[getStepStatus(index)]}`}
            >
              <div className={styles.stepIcon}>
                {getStepStatus(index) === 'completed' ? '✅' : 
                 getStepStatus(index) === 'active' ? (
                   <div className={styles.spinner}></div>
                 ) : step.icon}
              </div>
              
              <div className={styles.stepContent}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                
                {getStepStatus(index) === 'active' && (
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill}></div>
                  </div>
                )}
                
                {getStepStatus(index) === 'completed' && (
                  <p className={styles.stepComplete}>Completed</p>
                )}
              </div>
              
              <div className={styles.stepNumber}>{index + 1}</div>
            </div>
          ))}
        </div>

        {!processing && (
          <div className={styles.completionMessage}>
            <div className={styles.successIcon}>🎉</div>
            <h3>Transaction Successful!</h3>
            <p>Your order has been placed and payment is secured in the smart contract.</p>
            <p className={styles.deliveryInfo}>
              The farmer will receive payment automatically upon successful delivery confirmation.
            </p>
            
            <div className={styles.blockchainDetails}>
              <h4>Blockchain Details:</h4>
              <div className={styles.detailRow}>
                <span>Gas Used:</span>
                <span>21,000</span>
              </div>
              <div className={styles.detailRow}>
                <span>Block Number:</span>
                <span>{Math.floor(Math.random() * 1000000) + 15000000}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Confirmations:</span>
                <span>12/12</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.modalActions}>
          {processing ? (
            <button disabled className={styles.processingBtn}>
              <div className={styles.miniSpinner}></div>
              Processing Transaction...
            </button>
          ) : (
            <>
              <button onClick={onClose} className={styles.viewContractBtn}>
                View on Explorer
              </button>
              <button onClick={handleComplete} className={styles.completeBtn}>
                Continue to Order Tracking
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartContractModal;