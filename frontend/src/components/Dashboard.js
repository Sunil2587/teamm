import React, { useEffect, useState } from 'react';

const Dashboard = ({ expenses, tasks, team = [] }) => {
  // Fetch contributions and events from backend
  const [contributions, setContributions] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/contributions')
      .then(res => res.json())
      .then(data => setContributions(data));
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  // Total Money is the sum of all contributions
  const totalMoney = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  // Total Spent is the sum of all expense amounts
  const totalSpent = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  // Remaining is the difference between totalMoney and totalSpent
  const remaining = totalMoney - totalSpent;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const membersCount = team.length;

  return (
    <section className="section">
      <div className="container">
        <div className="dashboard-header">
          <div className="ganesh-centerpiece">
            <img
              src="https://pplx-res.cloudinary.com/image/upload/v1750436681/pplx_project_search_images/669a5e090695a2a1d3330f922e4ccefbd776ef59.jpg"
              alt="శ్రీ గణేశ చతుర్థి మహోత్సవం"
              className="ganesh-image"
            />
            <div className="divine-glow"></div>
          </div>
          <h1 className="dashboard-title" style={{ fontFamily: 'Noto Sans Telugu, sans-serif', letterSpacing: '1px' }}>
            శ్రీ గణేశ చతుర్థి మహోత్సవం
          </h1>
          <p className="dashboard-subtitle" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            దైవికాన్ని పరిపూర్ణంగా నిర్వహించడంలో ఆనందంగా జరుపుకుందాం
          </p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">🏛️</div>
            <div className="metric-value">₹{totalMoney.toLocaleString()}</div>
            <div className="metric-label">Total Money</div>
            <div className="metric-progress">
              <div className="progress-bar" style={{width: '100%'}}></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">💸</div>
            <div className="metric-value">₹{totalSpent.toLocaleString()}</div>
            <div className="metric-label">Total Spent</div>
            <div className="metric-progress">
              <div className="progress-bar" style={{width: `${totalMoney ? (totalSpent/totalMoney)*100 : 0}%`}}></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-value">₹{remaining.toLocaleString()}</div>
            <div className="metric-label">Remaining Budget</div>
            <div className="metric-progress">
              <div className="progress-bar" style={{width: `${totalMoney ? (remaining/totalMoney)*100 : 0}%`}}></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">✅</div>
            <div className="metric-value">{completedTasks}/{tasks.length}</div>
            <div className="metric-label">Tasks Completed</div>
            <div className="metric-progress">
              <div className="progress-bar" style={{width: `${(tasks.length ? (completedTasks/tasks.length)*100 : 0)}%`}}></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-value">{membersCount}</div>
            <div className="metric-label">Team Mahodara</div>
            <div className="metric-progress">
              <div className="progress-bar" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="upcoming-events">
            <h3 className="section-title">🎉 Upcoming Events</h3>
            <div className="event-timeline">
              {events.length === 0 ? (
                <div style={{ color: '#888', padding: '1rem' }}>No upcoming events.</div>
              ) : (
                events.map((event, idx) => (
                  <div className="timeline-item" key={idx}>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>{event.name}</h4>
                      <p>{event.description} <span style={{ color: '#888' }}>({event.date})</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;