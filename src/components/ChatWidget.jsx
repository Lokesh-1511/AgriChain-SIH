import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';
import IVRInfo from './IVRInfo';

const ChatWidget = ({ userType = 'consumer', intentPresets = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showIVRInfo, setShowIVRInfo] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Default intent presets based on user type
  const getDefaultIntents = () => {
    if (userType === 'farmer') {
      return [
        { text: '📊 Check Market Prices', intent: 'market_prices' },
        { text: '📦 List New Product', intent: 'list_product' },
        { text: '💰 Check Wallet Balance', intent: 'wallet_balance' },
        { text: '📞 Contact Support', intent: 'support' }
      ];
    } else {
      return [
        { text: '🛒 Find Products', intent: 'find_products' },
        { text: '📍 Track Order', intent: 'track_order' },
        { text: '💳 Payment Help', intent: 'payment_help' },
        { text: '🔍 Product Quality Info', intent: 'quality_info' }
      ];
    }
  };

  const intents = intentPresets.length > 0 ? intentPresets : getDefaultIntents();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && chatInputRef.current) {
      setTimeout(() => chatInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '' && uploadedImages.length === 0) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText.trim(),
      images: [...uploadedImages],
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setUploadedImages([]);

    // Show typing indicator
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const responses = getResponseForMessage(inputText.trim());
      const aiResponse = {
        id: Date.now() + 1,
        type: 'agent',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const getResponseForMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      if (userType === 'farmer') {
        return [
          "Current market prices: Tomatoes ₹40/kg, Rice ₹120/kg, Wheat ₹30/kg. These are based on today's wholesale rates.",
          "Market trends show tomatoes up 5% this week. Would you like detailed price history for specific crops?",
          "Live prices updated every hour. Premium organic products fetch 15-20% higher rates."
        ];
      } else {
        return [
          "I can help you find the best prices! Our products range from ₹25-400 depending on type and quality.",
          "Looking for specific products? Our price comparison shows the most competitive rates from verified farmers.",
          "Fresh produce prices vary by season. Would you like to see current deals and discounts?"
        ];
      }
    }
    
    if (lowerMessage.includes('product') || lowerMessage.includes('list') || lowerMessage.includes('sell')) {
      if (userType === 'farmer') {
        return [
          "To list a new product: Go to Dashboard → Add Product → Fill details with photos → Set price → Publish. Need help with any step?",
          "Product listing tips: Use clear photos, accurate descriptions, fair pricing. Quality products get more buyers!",
          "Your current listings: 3 active products. Average response time: 2 hours. Want to optimize your listings?"
        ];
      } else {
        return [
          "Browse our fresh products by category: Vegetables, Fruits, Grains, Dairy. All from verified local farmers!",
          "New arrivals today: Organic tomatoes, fresh mangoes, basmati rice. Free delivery on orders above ₹500.",
          "Product quality guaranteed! Every item has traceability info and farmer verification."
        ];
      }
    }
    
    if (lowerMessage.includes('wallet') || lowerMessage.includes('balance') || lowerMessage.includes('payment')) {
      if (userType === 'farmer') {
        return [
          "Your current wallet balance is ₹15,420. Last transaction: Payment received ₹800 for tomatoes sale.",
          "Payment pending: ₹1,200 (will be released after delivery confirmation). Bank transfer takes 2-3 business days.",
          "Wallet activity: 5 transactions this month. Total earnings: ₹28,500. Keep up the great work!"
        ];
      } else {
        return [
          "Payment options: UPI, Card, Net Banking, Wallet. All transactions are secure with 256-bit encryption.",
          "Your recent orders: ₹340 paid, ₹180 pending. COD available for orders under ₹1000.",
          "Payment troubleshooting: Check internet connection, verify card details, or try a different payment method."
        ];
      }
    }
    
    if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('delivery')) {
      return [
        "Order tracking: Your order #AG12345 is out for delivery, expected by 6 PM today.",
        "Delivery updates are sent via SMS. You can also track in real-time from your dashboard.",
        "Order history shows 12 successful deliveries. Average delivery time: 4-6 hours within city limits."
      ];
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('contact')) {
      return [
        "I'm here to help! You can also call our support: 1800-AGRI-HELP (24/7) or use the IVR system for quick queries.",
        "Common issues: Login problems, payment failures, delivery delays. What specific help do you need?",
        "Support options: Live chat (you're here!), Phone support, Email, or Hybrid IVR for voice commands."
      ];
    }
    
    // Default responses
    const defaultResponses = [
      "Thanks for your message! I'm AgriBot, here to help with all your AgriChain queries.",
      "I understand you need assistance. Could you be more specific about what you're looking for?",
      "I'm here to help with orders, products, payments, and general support. What would you like to know?",
      "Feel free to ask about market prices, product listings, payments, or any other AgriChain features!"
    ];
    
    return defaultResponses;
  };

  const handleQuickReply = (intent) => {
    const intentMessages = {
      market_prices: "What are the current market prices for my crops?",
      list_product: "How do I list a new product for sale?",
      wallet_balance: "Can you show me my wallet balance and recent transactions?",
      support: "I need help with my account",
      find_products: "Show me fresh products available near me",
      track_order: "Track my recent order status",
      payment_help: "I'm having trouble with payment",
      quality_info: "How do I verify product quality and certifications?"
    };

    const message = intentMessages[intent.intent] || intent.text;
    setInputText(message);
    setTimeout(handleSendMessage, 100);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + uploadedImages.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`${styles.chatToggle} ${isOpen ? styles.open : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat support'}
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && <span className={styles.chatBadge}>AI</span>}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className={styles.chatWidget} role="dialog" aria-label="Chat support">
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <h3>AgriBot Support</h3>
              <span className={styles.userType}>
                {userType === 'farmer' ? '🌾 Farmer' : '🛒 Consumer'} Assistant
              </span>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.ivrButton}
                onClick={() => setShowIVRInfo(true)}
                aria-label="Voice support options"
                title="Hybrid IVR Support"
              >
                📞
              </button>
              <button
                className={styles.closeButton}
                onClick={toggleChat}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Reply Buttons */}
          {messages.length === 0 && (
            <div className={styles.quickReplies} role="group" aria-label="Quick reply options">
              <p className={styles.quickRepliesLabel}>Quick Actions:</p>
              {intents.map((intent, index) => (
                <button
                  key={index}
                  className={styles.quickReplyButton}
                  onClick={() => handleQuickReply(intent)}
                  aria-label={`Quick reply: ${intent.text}`}
                >
                  {intent.text}
                </button>
              ))}
            </div>
          )}

          {/* Messages Area */}
          <div className={styles.messagesArea} role="log" aria-label="Chat messages">
            {messages.map(message => (
              <div
                key={message.id}
                className={`${styles.message} ${styles[message.type]}`}
              >
                <div className={styles.messageContent}>
                  {message.text && <p>{message.text}</p>}
                  {message.images && message.images.length > 0 && (
                    <div className={styles.messageImages}>
                      {message.images.map(img => (
                        <img
                          key={img.id}
                          src={img.preview}
                          alt={`Uploaded image: ${img.name}`}
                          className={styles.messageImage}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <span className={styles.messageTime}>{message.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.message} ${styles.agent}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Previews */}
          {uploadedImages.length > 0 && (
            <div className={styles.imagePreview}>
              {uploadedImages.map(img => (
                <div key={img.id} className={styles.previewItem}>
                  <img src={img.preview} alt={`Preview: ${img.name}`} />
                  <button
                    onClick={() => removeImage(img.id)}
                    aria-label={`Remove image: ${img.name}`}
                    className={styles.removeImage}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className={styles.inputArea}>
            <div className={styles.inputRow}>
              <textarea
                ref={chatInputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={styles.messageInput}
                aria-label="Type your message"
                rows="1"
                style={{
                  height: 'auto',
                  minHeight: '40px',
                  maxHeight: '120px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={styles.attachButton}
                aria-label="Attach images"
                title="Attach Images"
              >
                📎
              </button>
              <button
                onClick={handleSendMessage}
                className={styles.sendButton}
                disabled={inputText.trim() === '' && uploadedImages.length === 0}
                aria-label="Send message"
              >
                ➤
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              aria-label="File upload input"
            />
          </div>
        </div>
      )}

      {/* IVR Info Modal */}
      {showIVRInfo && (
        <IVRInfo 
          userType={userType} 
          onClose={() => setShowIVRInfo(false)} 
        />
      )}
    </>
  );
};

export default ChatWidget;