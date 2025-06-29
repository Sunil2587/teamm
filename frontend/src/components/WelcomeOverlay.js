import React from 'react';

const WelcomeOverlay = () => {
  return (
    <div className="welcome-overlay">
      <div className="welcome-content">
        <div className="om-symbol">ॐ</div>
        <h1 className="welcome-title">गणपति बप्पा मोरया</h1>
        <p className="welcome-subtitle">Welcome to Divine Festival Management</p>
        <div className="loading-mandala">
          <div className="mandala-spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
