import React from 'react';

const Profile = ({ user, expenses, tasks, onLogout }) => (
  <section className="section">
    <div
      className="container"
      style={{
        maxWidth: 500,
        margin: '2rem auto',
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 16px rgba(0,0,0,0.09)',
        padding: '2.5rem 2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '2.2rem',
            color: '#fff',
            boxShadow: '0 1px 6px rgba(0,0,0,0.10)'
          }}
        >
          {user?.name && user.name !== "Guest"
            ? user.name.split(' ').map(w => w[0]).join('').toUpperCase()
            : <span role="img" aria-label="guest">👤</span>}
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{user?.name || "Guest"}</h2>
          <div style={{ color: '#888', fontSize: '1rem' }}>{user?.email || "No email"}</div>
        </div>
      </div>
      <h3 style={{ marginTop: 0 }}>Your Activity</h3>
      <ul style={{ paddingLeft: 18, marginBottom: 18 }}>
        <li>Expenses added: <b>{expenses.length}</b></li>
        <li>Tasks created: <b>{tasks.length}</b></li>
        {/* You can add more activity details here */}
      </ul>
      <button
        onClick={onLogout}
        style={{
          background: 'linear-gradient(90deg, #ff5858 0%, #f857a6 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '1.2rem',
          padding: '0.5rem 1.5rem',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 1px 4px rgba(248,87,166,0.08)'
        }}
      >
        Logout
      </button>
    </div>
  </section>
);

export default Profile;