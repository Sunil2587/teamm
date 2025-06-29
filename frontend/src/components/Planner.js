import React, { useState, useEffect } from 'react';

const Planner = ({ tasks, onAddTask, onUpdateTaskStatus, team = [], user }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'Medium'
  });
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    date: ''
  });

  // Fetch events from backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({
      ...formData,
      status: 'To Do'
    });
    setFormData({ title: '', description: '', assignee: '', dueDate: '', priority: 'Medium' });
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Event handlers
  const handleEventInputChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value
    });
  };

  // Save event to backend and update local state
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    // Save to backend
    const res = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventForm)
    });
    const savedEvent = await res.json();
    setEvents([...events, savedEvent]);
    setEventForm({ name: '', description: '', date: '' });
    setShowEventModal(false);
  };

  const handleTaskClick = (taskId) => {
    const task = tasks.find(t => t.id === taskId || t._id === taskId);
    let newStatus = task.status;
    if (task.status === 'To Do') {
      newStatus = 'In Progress';
    } else if (task.status === 'In Progress') {
      newStatus = 'Completed';
    }
    if (newStatus !== task.status) {
      onUpdateTaskStatus(taskId, newStatus);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
  };

  const tasksByStatus = {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Completed': tasks.filter(task => task.status === 'Completed')
  };

  const columnConfig = {
    'To Do': { title: '📝 To Do', icon: '📝' },
    'In Progress': { title: '⏳ In Progress', icon: '⏳' },
    'Completed': { title: '✅ Completed', icon: '✅' }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="section-title">📋 Divine Event Planning</h2>
            <button className="btn btn--primary" onClick={() => setShowModal(true)}>
              <span className="btn-icon">➕</span>
              Add Task
            </button>
          </div>
          <div>
            <button className="btn btn--secondary" onClick={() => setShowEventModal(true)}>
              <span className="btn-icon">🎉</span>
              Add Event
            </button>
          </div>
        </div>

        {/* Display Events near dashboard */}
        {events.length > 0 && (
          <div className="event-list" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Upcoming Events</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {events.map((event, idx) => (
                <li key={event._id || idx} style={{ marginBottom: '0.5rem', background: '#f9f9f9', borderRadius: 8, padding: '0.5rem 1rem' }}>
                  <strong>{event.name}</strong> - {event.description} <span style={{ color: '#888' }}>({event.date})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="tasks-board">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="task-column">
              <h3 className="column-title">{columnConfig[status].title}</h3>
              {statusTasks.map(task => (
                <div
                  key={task._id || task.id}
                  className={`task-card ${task.priority?.toLowerCase()}-priority`}
                  onClick={() => handleTaskClick(task._id || task.id)}
                  style={{ cursor: (task.status === 'To Do' || task.status === 'In Progress') ? 'pointer' : 'default' }}
                >
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <span className={`priority-badge ${task.priority?.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p>{task.description}</p>
                  <div className="task-footer">
                    <div className="assignee">
                      <div className="avatar">{getInitials(task.assignee)}</div>
                      <span>{task.assignee}</span>
                    </div>
                    <span className="due-date">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                  </div>
                  {task.status === 'Completed' && (
                    <div style={{ marginTop: '0.5rem', color: 'green', fontWeight: 'bold' }}>
                      Task Completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="team-section">
          <h3 className="section-title">👥 Divine Team</h3>
          <div className="team-grid">
            {team.map(member => (
              <div key={member._id} className="team-member online">
                <div className="member-avatar">{getInitials(member.name)}</div>
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <p>{member.email}</p>
                </div>
                <div className="status-indicator online"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Task Modal */}
        {showModal && (
          <div className="modal" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add New Task</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select
                    name="assignee"
                    className="form-control"
                    value={formData.assignee}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Assignee</option>
                    {team.map(member => (
                      <option key={member._id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="form-control"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    name="priority"
                    className="form-control"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary">
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Event Modal */}
        {showEventModal && (
          <div className="modal" onClick={() => setShowEventModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add New Event</h3>
                <button className="modal-close" onClick={() => setShowEventModal(false)}>×</button>
              </div>
              <form onSubmit={handleEventSubmit}>
                <div className="form-group">
                  <label className="form-label">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={eventForm.name}
                    onChange={handleEventInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={eventForm.description}
                    onChange={handleEventInputChange}
                    rows="2"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={eventForm.date}
                    onChange={handleEventInputChange}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setShowEventModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary">
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Planner;