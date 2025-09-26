import React from 'react';
import styles from './IVRInfo.module.css';

const IVRInfo = ({ userType = 'consumer', onClose }) => {
  const getIVRMenus = () => {
    if (userType === 'farmer') {
      return {
        title: 'Farmer Hybrid IVR System',
        description: 'Access AgriChain services via voice commands and numeric keypad',
        mainMenu: [
          { key: '1', action: 'Market Prices & Trends', description: 'Get current market rates for your crops' },
          { key: '2', action: 'Product Management', description: 'List, update, or remove your products' },
          { key: '3', action: 'Sales & Earnings', description: 'Check sales, wallet balance, pending payments' },
          { key: '4', action: 'Order Management', description: 'View incoming orders and delivery status' },
          { key: '5', action: 'Account & Support', description: 'Profile settings, KYC status, help center' },
          { key: '9', action: 'Emergency Support', description: 'Connect to human agent immediately' },
          { key: '0', action: 'Language Options', description: 'Switch between Hindi, English, regional languages' }
        ],
        subMenus: {
          '1': [
            { key: '11', action: 'Today\'s Prices', voice: 'Say "current prices for tomatoes"' },
            { key: '12', action: 'Weekly Trends', voice: 'Say "price trends this week"' },
            { key: '13', action: 'Best Selling Crops', voice: 'Say "what crops sell best"' }
          ],
          '2': [
            { key: '21', action: 'Add New Product', voice: 'Say "list new tomatoes"' },
            { key: '22', action: 'Update Inventory', voice: 'Say "update rice quantity"' },
            { key: '23', action: 'Product Status', voice: 'Say "show my active listings"' }
          ],
          '3': [
            { key: '31', action: 'Wallet Balance', voice: 'Say "check my balance"' },
            { key: '32', action: 'Recent Transactions', voice: 'Say "show recent payments"' },
            { key: '33', action: 'Pending Amounts', voice: 'Say "what payments are pending"' }
          ]
        },
        voiceExamples: [
          '"Check tomato prices" → Get current market rate',
          '"List new mangoes 50 kg" → Quick product listing',
          '"Show my wallet" → Balance and transaction history',
          '"Emergency help" → Connect to human agent'
        ]
      };
    } else {
      return {
        title: 'Consumer Hybrid IVR System',
        description: 'Shop and track orders using voice commands and keypad',
        mainMenu: [
          { key: '1', action: 'Browse & Search', description: 'Find products, compare prices, check availability' },
          { key: '2', action: 'Cart & Checkout', description: 'Manage cart, place orders, payment options' },
          { key: '3', action: 'Order Tracking', description: 'Track deliveries, return/exchange, delivery updates' },
          { key: '4', action: 'Account & Payments', description: 'Profile, saved addresses, payment methods' },
          { key: '5', action: 'Product Information', description: 'Quality details, farmer info, certifications' },
          { key: '9', action: 'Customer Support', description: 'Live agent, complaints, feedback' },
          { key: '0', action: 'Language & Settings', description: 'Change language, notification preferences' }
        ],
        subMenus: {
          '1': [
            { key: '11', action: 'Find Products', voice: 'Say "find fresh tomatoes near me"' },
            { key: '12', action: 'Compare Prices', voice: 'Say "compare rice prices"' },
            { key: '13', action: 'Check Quality', voice: 'Say "show organic vegetables"' }
          ],
          '2': [
            { key: '21', action: 'Add to Cart', voice: 'Say "add 2 kg tomatoes to cart"' },
            { key: '22', action: 'Place Order', voice: 'Say "place my order"' },
            { key: '23', action: 'Payment Help', voice: 'Say "payment not working"' }
          ],
          '3': [
            { key: '31', action: 'Track Order', voice: 'Say "where is my order"' },
            { key: '32', action: 'Delivery Status', voice: 'Say "when will it arrive"' },
            { key: '33', action: 'Return Item', voice: 'Say "return damaged tomatoes"' }
          ]
        },
        voiceExamples: [
          '"Find organic tomatoes" → Search nearby organic produce',
          '"Add 5 kg rice to cart" → Direct cart addition',
          '"Track order AG12345" → Real-time delivery status',
          '"Connect to agent" → Human customer support'
        ]
      };
    }
  };

  const menuData = getIVRMenus();

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} onKeyPress={handleKeyPress} tabIndex="0">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2>{menuData.title}</h2>
            <p className={styles.description}>{menuData.description}</p>
          </div>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close IVR information"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Phone Access Instructions */}
          <div className={styles.accessInfo}>
            <div className={styles.phoneAccess}>
              <h3>📞 Phone Access</h3>
              <div className={styles.phoneNumber}>
                <strong>Call: 1800-AGRI-HELP</strong>
                <span className={styles.phoneSubtext}>(1800-2474-4357)</span>
              </div>
              <p>24/7 Multilingual support • Hindi, English + 12 regional languages</p>
            </div>
            
            <div className={styles.webAccess}>
              <h3>💬 Web Access</h3>
              <p>This chat widget also accepts voice commands!</p>
              <p>Try saying: <em>"Check prices"</em> or <em>"Track my order"</em></p>
            </div>
          </div>

          {/* Main Menu */}
          <div className={styles.menuSection}>
            <h3>🔢 Main Menu Options</h3>
            <div className={styles.menuGrid}>
              {menuData.mainMenu.map(item => (
                <div key={item.key} className={styles.menuItem}>
                  <div className={styles.menuKey}>Press {item.key}</div>
                  <div className={styles.menuContent}>
                    <strong>{item.action}</strong>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-menu Examples */}
          <div className={styles.subMenuSection}>
            <h3>📋 Quick Actions (Sub-menus)</h3>
            <div className={styles.subMenuTabs}>
              {Object.entries(menuData.subMenus).map(([mainKey, subItems]) => {
                const mainItem = menuData.mainMenu.find(item => item.key === mainKey);
                return (
                  <div key={mainKey} className={styles.subMenuTab}>
                    <h4>{mainItem?.action} (Press {mainKey})</h4>
                    <div className={styles.subMenuItems}>
                      {subItems.map(subItem => (
                        <div key={subItem.key} className={styles.subMenuItem}>
                          <span className={styles.subMenuKey}>{subItem.key}</span>
                          <div className={styles.subMenuInfo}>
                            <strong>{subItem.action}</strong>
                            <em>{subItem.voice}</em>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Command Examples */}
          <div className={styles.voiceSection}>
            <h3>🎙️ Voice Command Examples</h3>
            <div className={styles.voiceExamples}>
              {menuData.voiceExamples.map((example, index) => (
                <div key={index} className={styles.voiceExample}>
                  <span className={styles.voiceCommand}>
                    {example.split(' → ')[0]}
                  </span>
                  <span className={styles.voiceResult}>
                    → {example.split(' → ')[1]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Features */}
          <div className={styles.accessibilitySection}>
            <h3>♿ Accessibility Features</h3>
            <div className={styles.accessibilityGrid}>
              <div className={styles.accessibilityFeature}>
                <strong>🔊 Audio Navigation</strong>
                <p>Complete voice-guided menu system with clear audio prompts</p>
              </div>
              <div className={styles.accessibilityFeature}>
                <strong>⌨️ Keyboard Support</strong>
                <p>All functions accessible via numeric keypad or voice</p>
              </div>
              <div className={styles.accessibilityFeature}>
                <strong>🌐 Multi-language</strong>
                <p>Available in Hindi, English, Tamil, Telugu, Bengali + 8 more</p>
              </div>
              <div className={styles.accessibilityFeature}>
                <strong>⏯️ Repeat Options</strong>
                <p>Press * to repeat menu, # to go back, 0 for help</p>
              </div>
            </div>
          </div>

          {/* Usage Tips */}
          <div className={styles.tipsSection}>
            <h3>💡 Usage Tips</h3>
            <ul className={styles.tipsList}>
              <li><strong>Speed Dialing:</strong> Save 1800-AGRI-HELP in your contacts</li>
              <li><strong>Voice Recognition:</strong> Speak clearly, mention product names and quantities</li>
              <li><strong>Emergency Help:</strong> Press 9 anytime to connect to human agent</li>
              <li><strong>Transaction ID:</strong> Keep your order/transaction ID ready for faster service</li>
              <li><strong>Network Issues:</strong> SMS "HELP" to 56767 if call quality is poor</li>
            </ul>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <p><strong>Available 24/7</strong> • Average wait time: &lt; 30 seconds</p>
            <p>For immediate assistance: Press 9 or say "Emergency Support"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IVRInfo;