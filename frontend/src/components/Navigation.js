import React from 'react';

const Navigation = ({ currentSection, onSectionChange, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', icon: '🏛️', label: 'Dashboard' },
    { id: 'expenses', icon: '💰', label: 'Expenses' },
    { id: 'planner', icon: '📋', label: 'Planner' },
    { id: 'gallery', icon: '🖼️', label: 'Gallery' },
    { id: 'chat', icon: '💬', label: 'Chat' },
    { id: 'info', icon: 'ℹ️', label: 'Info' }, // <-- Added Info tab
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <nav className="nav-temple">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-om">ॐ</span>
          <span className="nav-title">Team Mahodara</span>
        </div>
        <div className="nav-menu">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-link ${currentSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        <div
          className="profile-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            marginLeft: 'auto',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: '0.2rem 1.2rem 0.2rem 0.7rem',
            minWidth: '150px',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s'
          }}
          onClick={() => onSectionChange('profile')}
          title="View Profile"
        >
          <div
            className="profile-avatar"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.3rem',
              color: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
            }}
          >
            {user?.name && user.name !== "Guest"
              ? user.name
                  .split(' ')
                  .map(word => word[0])
                  .join('')
                  .toUpperCase()
              : <span role="img" aria-label="guest">👤</span>}
          </div>
          <span className="profile-name" style={{ fontWeight: 600, color: '#333', fontSize: '1.05rem' }}>
            {user?.name || "Guest"}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;