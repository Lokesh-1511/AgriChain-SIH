import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/FarmerVerification.module.css';

const FarmerVerification = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [aadhaarVerified, setAadhaarVerified] = useState(true); // Mock as verified from previous step
  const [landType, setLandType] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({
    landRecord: null,
    leaseAgreement: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [farmerId, setFarmerId] = useState('');

  // Generate unique farmer ID
  const generateFarmerId = () => {
    const prefix = 'AGR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  // Mock file upload handler
  const handleFileUpload = (fileType, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: {
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          type: file.type
        }
      }));
    }
  };

  const handleVerifyLand = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate unique farmer ID
      const newFarmerId = generateFarmerId();
      setFarmerId(newFarmerId);
      
      // Show success card
      setShowSuccess(true);
      
      // Store farmer verification in localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...currentUser,
        farmerId: newFarmerId,
        landType,
        uploadedFiles,
        verificationStatus: 'complete',
        verificationDate: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update farmers array in localStorage
      const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
      const farmerIndex = farmers.findIndex(f => f.email === currentUser.email);
      if (farmerIndex !== -1) {
        farmers[farmerIndex] = updatedUser;
        localStorage.setItem('farmers', JSON.stringify(farmers));
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadId = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const farmerData = {
      farmerId: farmerId,
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
      landType: landType,
      verificationDate: new Date().toISOString(),
      issuer: 'AgriChain Platform'
    };
    
    const dataStr = JSON.stringify(farmerData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `AgriChain_Farmer_ID_${farmerId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleContinueToDashboard = () => {
    // Redirect to farmer dashboard after 1 second
    setTimeout(() => {
      navigate('/farmer/dashboard');
    }, 1000);
  };

  const canVerify = () => {
    if (landType === 'owned' && uploadedFiles.landRecord) return true;
    if (landType === 'lease' && uploadedFiles.landRecord && uploadedFiles.leaseAgreement) return true;
    return false;
  };

  if (showSuccess) {
    return (
      <div className={styles.verificationPage}>
        <div className={styles.successContainer}>
          <div className={styles.successCard}>
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
            
            <div className={styles.confetti}>
              <div className={styles.confettiPiece}></div>
              <div className={styles.confettiPiece}></div>
              <div className={styles.confettiPiece}></div>
              <div className={styles.confettiPiece}></div>
              <div className={styles.confettiPiece}></div>
              <div className={styles.confettiPiece}></div>
            </div>
            
            <h1 className={styles.successTitle}>Verification Successful!</h1>
            <p className={styles.successMessage}>
              Congratulations! Your farmer verification is complete.
            </p>
            
            <div className={styles.farmerIdCard}>
              <h3>Your Unique Farmer ID</h3>
              <div className={styles.farmerId}>{farmerId}</div>
              <p>Save this ID for all future transactions</p>
            </div>
            
            <div className={styles.successActions}>
              <button 
                className={styles.downloadButton}
                onClick={handleDownloadId}
              >
                📄 Download ID Certificate
              </button>
              <button 
                className={styles.continueButton}
                onClick={handleContinueToDashboard}
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.verificationPage}>
      <div className={styles.verificationContainer}>
        <div className={styles.verificationCard}>
          <div className={styles.verificationHeader}>
            <h1 className={styles.verificationTitle}>Farmer Verification</h1>
            <p className={styles.verificationSubtitle}>
              Complete your verification to access AgriChain features
            </p>
          </div>
          
          {/* Aadhaar Status */}
          <div className={styles.statusSection}>
            <div className={styles.statusItem}>
              <div className={`${styles.statusIcon} ${aadhaarVerified ? styles.verified : styles.pending}`}>
                {aadhaarVerified ? '✓' : '⏳'}
              </div>
              <div className={styles.statusText}>
                <h3>Aadhaar Verification</h3>
                <p>{aadhaarVerified ? 'Verified successfully' : 'Verification pending'}</p>
              </div>
            </div>
          </div>
          
          {/* Land Verification Section */}
          <div className={styles.landSection}>
            <h2 className={styles.sectionTitle}>Land Verification</h2>
            <p className={styles.sectionDescription}>
              Please select your land ownership type and provide required documents
            </p>
            
            <div className={styles.radioGroup}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="landType"
                  value="owned"
                  checked={landType === 'owned'}
                  onChange={(e) => setLandType(e.target.value)}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  <span className={styles.radioButton}></span>
                  <span className={styles.radioText}>
                    <strong>Owned Land</strong>
                    <small>I own the agricultural land</small>
                  </span>
                </span>
              </label>
              
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="landType"
                  value="lease"
                  checked={landType === 'lease'}
                  onChange={(e) => setLandType(e.target.value)}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  <span className={styles.radioButton}></span>
                  <span className={styles.radioText}>
                    <strong>Lease/Rent</strong>
                    <small>I lease or rent the agricultural land</small>
                  </span>
                </span>
              </label>
            </div>
          </div>
          
          {/* File Upload Section */}
          {landType && (
            <div className={styles.uploadsSection}>
              <h3 className={styles.uploadTitle}>Required Documents</h3>
              
              <div className={styles.uploadCards}>
                <div className={styles.uploadCard}>
                  <div className={styles.uploadHeader}>
                    <h4>{landType === 'owned' ? 'Land Ownership Document' : 'Owner Land Record'}</h4>
                    <span className={styles.required}>Required</span>
                  </div>
                  <div className={styles.uploadArea}>
                    <input
                      type="file"
                      id="landRecord"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('landRecord', e)}
                      className={styles.fileInput}
                    />
                    <label htmlFor="landRecord" className={styles.uploadLabel}>
                      {uploadedFiles.landRecord ? (
                        <div className={styles.filePreview}>
                          <div className={styles.fileIcon}>📄</div>
                          <div className={styles.fileInfo}>
                            <div className={styles.fileName}>{uploadedFiles.landRecord.name}</div>
                            <div className={styles.fileSize}>{uploadedFiles.landRecord.size}</div>
                          </div>
                          <div className={styles.fileStatus}>✓</div>
                        </div>
                      ) : (
                        <div className={styles.uploadPlaceholder}>
                          <div className={styles.uploadIcon}>📁</div>
                          <div>Click to upload {landType === 'owned' ? 'ownership document' : 'land record'}</div>
                          <small>PDF, JPG, PNG (Max 10MB)</small>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                {landType === 'lease' && (
                  <div className={styles.uploadCard}>
                    <div className={styles.uploadHeader}>
                      <h4>Lease/Rent Agreement</h4>
                      <span className={styles.required}>Required</span>
                    </div>
                    <div className={styles.uploadArea}>
                      <input
                        type="file"
                        id="leaseAgreement"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('leaseAgreement', e)}
                        className={styles.fileInput}
                      />
                      <label htmlFor="leaseAgreement" className={styles.uploadLabel}>
                        {uploadedFiles.leaseAgreement ? (
                          <div className={styles.filePreview}>
                            <div className={styles.fileIcon}>📄</div>
                            <div className={styles.fileInfo}>
                              <div className={styles.fileName}>{uploadedFiles.leaseAgreement.name}</div>
                              <div className={styles.fileSize}>{uploadedFiles.leaseAgreement.size}</div>
                            </div>
                            <div className={styles.fileStatus}>✓</div>
                          </div>
                        ) : (
                          <div className={styles.uploadPlaceholder}>
                            <div className={styles.uploadIcon}>📁</div>
                            <div>Click to upload lease agreement</div>
                            <small>PDF, JPG, PNG (Max 10MB)</small>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Verify Button */}
          <div className={styles.verifySection}>
            <button
              className={styles.verifyButton}
              onClick={handleVerifyLand}
              disabled={!canVerify() || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Complete Verification'}
            </button>
            
            {landType && !canVerify() && (
              <p className={styles.uploadHint}>
                {landType === 'owned' 
                  ? 'Please upload your land ownership document to proceed'
                  : 'Please upload both required documents to proceed'
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerVerification;