import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TracePage.module.css';
import { fetchTraceData } from '../utils/fakeApi';

const TracePage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  // Cache busting comment - 2025-09-26
  const [traceData, setTraceData] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBlockchainModal, setShowBlockchainModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    // Fetch trace data using fake API
    const loadTraceData = async () => {
      setLoading(true);
      try {
        const response = await fetchTraceData(productId);
        if (response.success) {
          setTraceData(response.data);
        } else {
          console.error('Failed to fetch trace data');
        }
      } catch (error) {
        console.error('Error fetching trace data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadTraceData();
    }
  }, [productId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'active':
        return '🔄';
      case 'pending':
        return '⏳';
      default:
        return '⚪';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'active':
        return '#2196F3';
      case 'pending':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Pending';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBlockchainVerify = (transaction, stepData) => {
    setSelectedTransaction({
      ...transaction,
      stepData: stepData
    });
    setShowBlockchainModal(true);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading trace information...</p>
      </div>
    );
  }

  if (!traceData) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <p>The requested product trace information could not be found.</p>
        <button onClick={() => navigate('/consumer-dashboard')} className={styles.backButton}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className={styles.tracePageContainer}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back
        </button>
        <div className={styles.productInfo}>
          <h1>{traceData.name}</h1>
          <p className={styles.farmerInfo}>
            Farmer: <strong>{traceData.farmerName}</strong> | 
            Location: <strong>{traceData.farmerAddress}</strong>
          </p>
          <div className={styles.productMeta}>
            <span className={styles.batchNumber}>Batch: {traceData.batchNumber}</span>
            <span className={styles.agriScore}>AgriScore: {traceData.agriScore}/100</span>
          </div>
        </div>
      </div>

      <div className={styles.blockchainInfo}>
        <h3>🔐 Blockchain Verification</h3>
        <div className={styles.blockchainDetails}>
          <span>Contract: {traceData.blockchain.contractAddress}</span>
          <span>Block: #{traceData.blockchain.blockNumber}</span>
          <span>Confirmations: {traceData.blockchain.confirmations}</span>
          <button 
            className={styles.verifyBtn}
            onClick={() => handleBlockchainVerify(traceData.blockchain, traceData)}
          >
            Verify on Blockchain
          </button>
        </div>
      </div>

      <div className={styles.timelineContainer}>
        <h2>Supply Chain Timeline</h2>
        <div className={styles.timeline}>
          {traceData.timeline.map((step, index) => (
            <div 
              key={step.id} 
              className={`${styles.timelineStep} ${activeStep === step.id ? styles.active : ''}`}
              style={{ '--step-color': getStatusColor(step.status) }}
            >
              <div className={styles.stepIcon}>
                {getStatusIcon(step.status)}
              </div>
              
              <div className={styles.stepContent}>
                <div className={styles.stepHeader} onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}>
                  <h3>{step.stage}: {step.title}</h3>
                  <span className={styles.stepTime}>{formatDate(step.timestamp)}</span>
                  <span className={styles.expandIcon}>
                    {activeStep === step.id ? '−' : '+'}
                  </span>
                </div>
                
                <p className={styles.stepDescription}>{step.description}</p>
                
                {activeStep === step.id && (
                  <div className={styles.stepDetails}>
                    <div className={styles.locationInfo}>
                      <h4>📍 Location</h4>
                      <p><strong>{step.location.name}</strong></p>
                      <p>{step.location.address}</p>
                    </div>
                    
                    {step.details && (
                      <div className={styles.additionalDetails}>
                        <h4>📋 Details</h4>
                        {Object.entries(step.details).map(([key, value]) => (
                          <div key={key} className={styles.detailItem}>
                            <span className={styles.detailKey}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </span>
                            <span className={styles.detailValue}>
                              {Array.isArray(value) ? value.join(', ') : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {step.blockchain && (
                      <div className={styles.blockchainStep}>
                        <h4>⛓️ Blockchain Transaction</h4>
                        <p>TX: {step.blockchain.txHash}</p>
                        <p>Block: #{step.blockchain.blockNumber}</p>
                        <p>Time: {formatDate(step.blockchain.timestamp)}</p>
                        <button 
                          className={styles.verifyStepBtn}
                          onClick={() => handleBlockchainVerify(step.blockchain, step)}
                        >
                          Verify Step
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {index < traceData.timeline.length - 1 && (
                <div className={styles.stepConnector}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {traceData.certificates && traceData.certificates.length > 0 && (
        <div className={styles.certificatesSection}>
          <h3>📜 Certifications</h3>
          <div className={styles.certificates}>
            {traceData.certificates.map((cert, index) => (
              <div key={index} className={styles.certificate}>
                <h4>{cert.name}</h4>
                <p>Issued by: {cert.issuer}</p>
                <p>Certificate #: {cert.number}</p>
                <p>Valid until: {new Date(cert.validUntil).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {traceData.sustainability && (
        <div className={styles.sustainabilitySection}>
          <h3>🌱 Sustainability Impact</h3>
          <div className={styles.sustainabilityGrid}>
            <div className={styles.sustainabilityItem}>
              <span className={styles.sustainabilityLabel}>Carbon Footprint</span>
              <span className={styles.sustainabilityValue}>{traceData.sustainability.carbonFootprint}</span>
            </div>
            <div className={styles.sustainabilityItem}>
              <span className={styles.sustainabilityLabel}>Water Usage</span>
              <span className={styles.sustainabilityValue}>{traceData.sustainability.waterUsage}</span>
            </div>
            <div className={styles.sustainabilityItem}>
              <span className={styles.sustainabilityLabel}>Sustainability Score</span>
              <span className={styles.sustainabilityValue}>{traceData.sustainability.sustainabilityScore}/10</span>
            </div>
          </div>
        </div>
      )}

      {/* Blockchain Verification Modal */}
      {showBlockchainModal && selectedTransaction && (
        <div className={styles.modalOverlay} onClick={() => setShowBlockchainModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>⛓️ Blockchain Verification</h2>
              <button 
                className={styles.closeModal}
                onClick={() => setShowBlockchainModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              {selectedTransaction.stepData && (
                <div className={styles.stepInfo}>
                  <h3>Step: {selectedTransaction.stepData.stage || selectedTransaction.stepData.name}</h3>
                </div>
              )}
              <div className={styles.transactionDetails}>
                <div className={styles.detailRow}>
                  <span>Transaction Hash:</span>
                  <span className={styles.hashValue}>{selectedTransaction.txHash || selectedTransaction.mainTxHash}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Block Number:</span>
                  <span>#{selectedTransaction.blockNumber}</span>
                </div>
                {selectedTransaction.contractAddress && (
                  <div className={styles.detailRow}>
                    <span>Contract Address:</span>
                    <span className={styles.hashValue}>{selectedTransaction.contractAddress}</span>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <span>Timestamp:</span>
                  <span>{formatDate(selectedTransaction.timestamp)}</span>
                </div>
                {selectedTransaction.gasUsed && (
                  <div className={styles.detailRow}>
                    <span>Gas Used:</span>
                    <span>{selectedTransaction.gasUsed.toLocaleString()}</span>
                  </div>
                )}
                {selectedTransaction.confirmations && (
                  <div className={styles.detailRow}>
                    <span>Confirmations:</span>
                    <span>{selectedTransaction.confirmations}</span>
                  </div>
                )}
              </div>
              <div className={styles.verificationStatus}>
                <div className={styles.verified}>
                  ✅ Transaction verified on blockchain
                </div>
                <p>This transaction has been permanently recorded on the blockchain and cannot be altered.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TracePage;