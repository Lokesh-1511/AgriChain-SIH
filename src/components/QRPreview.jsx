import React, { useState } from 'react';
import styles from './QRPreview.module.css';

const QRPreview = ({ productId, productName, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate QR code URL for the product trace page
  const traceUrl = `${window.location.origin}/trace/${productId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(traceUrl)}`;

  const handleDownloadQR = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${productName}-QR-Code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${productName}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: Arial, sans-serif;
            }
            .qr-container {
              text-align: center;
              border: 2px solid #333;
              padding: 20px;
              border-radius: 10px;
            }
            .product-info {
              margin-bottom: 20px;
            }
            .instructions {
              margin-top: 20px;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="product-info">
              <h2>${productName}</h2>
              <p><strong>Product ID:</strong> ${productId}</p>
            </div>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <div class="instructions">
              <p>Scan this QR code to view complete product traceability</p>
              <p>Trace URL: ${traceUrl}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(traceUrl);
      // Show a temporary success message
      const button = document.getElementById('copy-url-btn');
      const originalText = button.textContent;
      button.textContent = '✅ Copied!';
      button.style.background = '#4CAF50';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = traceUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Trace URL copied to clipboard!');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>🔗 Product QR Code</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.productInfo}>
            <h3>{productName}</h3>
            <p className={styles.productId}>Product ID: {productId}</p>
          </div>
          
          <div className={styles.qrContainer}>
            <img 
              src={qrCodeUrl} 
              alt="Product QR Code"
              className={styles.qrImage}
            />
            <p className={styles.qrDescription}>
              Scan this QR code to view complete product traceability and blockchain verification
            </p>
          </div>
          
          <div className={styles.urlSection}>
            <label>Trace URL:</label>
            <div className={styles.urlContainer}>
              <input 
                type="text" 
                value={traceUrl} 
                readOnly 
                className={styles.urlInput}
              />
              <button 
                id="copy-url-btn"
                onClick={handleCopyUrl}
                className={styles.copyBtn}
              >
                📋 Copy
              </button>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button 
              onClick={handleDownloadQR}
              disabled={isDownloading}
              className={styles.downloadBtn}
            >
              {isDownloading ? (
                <>
                  <span className={styles.spinner}></span>
                  Downloading...
                </>
              ) : (
                <>📱 Download QR</>
              )}
            </button>
            
            <button 
              onClick={handlePrintQR}
              className={styles.printBtn}
            >
              🖨️ Print QR
            </button>
            
            <button 
              onClick={() => window.open(traceUrl, '_blank')}
              className={styles.viewBtn}
            >
              👁️ View Trace
            </button>
          </div>
          
          <div className={styles.instructions}>
            <h4>📋 How to use:</h4>
            <ul>
              <li>Print and attach QR code to product packaging</li>
              <li>Consumers can scan to view complete supply chain trace</li>
              <li>Blockchain verification ensures authenticity</li>
              <li>Works with any QR code scanner app</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPreview;