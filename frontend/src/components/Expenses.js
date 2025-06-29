import React, { useState, useEffect } from 'react';

const Expenses = ({ expenses = [], onAddExpense }) => {
  const [showModal, setShowModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  const [contributions, setContributions] = useState([]);
  const [contributionData, setContributionData] = useState({
    name: '',
    amount: ''
  });

  const [sponsors, setSponsors] = useState([]);
  const [sponsorData, setSponsorData] = useState({
    name: '',
    message: ''
  });

  useEffect(() => {
    fetchContributions();
    fetchSponsors();
  }, []);

  const fetchContributions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/contributions');
      const data = await res.json();
      setContributions(data);
    } catch (err) {}
  };

  const fetchSponsors = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/sponsors');
      const data = await res.json();
      setSponsors(data);
    } catch (err) {}
  };

  // Delete sponsor by id
  const handleDeleteSponsor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sponsor?')) return;
    await fetch(`http://localhost:5000/api/sponsors/${id}`, { method: 'DELETE' });
    fetchSponsors();
  };

  const totalBudget = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalSpent = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const remaining = totalBudget - totalSpent;

  const handleContributeInput = (e) => {
    setContributionData({
      ...contributionData,
      [e.target.name]: e.target.value
    });
  };

  const handleContributeSubmit = async (e) => {
    e.preventDefault();
    const addAmount = parseFloat(contributionData.amount);
    if (!isNaN(addAmount) && addAmount > 0 && contributionData.name.trim() !== '') {
      await fetch('http://localhost:5000/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contributionData.name, amount: addAmount })
      });
      setContributionData({ name: '', amount: '' });
      setShowContributeModal(false);
      fetchContributions();
    }
  };

  const handleSponsorInput = (e) => {
    setSponsorData({
      ...sponsorData,
      [e.target.name]: e.target.value
    });
  };

  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    if (sponsorData.name.trim() !== '' && sponsorData.message.trim() !== '') {
      await fetch('http://localhost:5000/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sponsorData.name, message: sponsorData.message })
      });
      setSponsorData({ name: '', message: '' });
      setShowSponsorModal(false);
      fetchSponsors();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: formData.date || new Date().toISOString().slice(0, 10)
    };
    if (onAddExpense) onAddExpense(newExpense);
    setFormData({ title: '', amount: '', category: '', date: '', description: '' });
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getExpenseIcon = (category) => {
    switch(category) {
      case 'Food': return '🍯';
      case 'Decorations': return '🌺';
      case 'Equipment': return '🎵';
      default: return '💰';
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="section-title">💰 Sacred Expense Tracking</h2>
          <div>
            <button
              className="btn btn--primary"
              style={{ marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              onClick={() => setShowContributeModal(true)}
            >
              <span className="btn-icon">💸</span>
              Contribute
            </button>
            <button
              className="btn btn--primary"
              style={{ marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              onClick={() => setShowSponsorModal(true)}
            >
              <span className="btn-icon">🎁</span>
              Add Sponsor
            </button>
            <button
              className="btn btn--primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              onClick={() => setShowModal(true)}
            >
              <span className="btn-icon">➕</span>
              Add Expense
            </button>
          </div>
        </div>

        <div className="expense-summary">
          <div className="summary-card">
            <div className="summary-icon">🏛️</div>
            <div className="summary-details">
              <h3>Total Budget</h3>
              <p className="amount">₹{totalBudget.toLocaleString()}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">💸</div>
            <div className="summary-details">
              <h3>Amount Spent</h3>
              <p className="amount spent">₹{totalSpent.toLocaleString()}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">💰</div>
            <div className="summary-details">
              <h3>Remaining</h3>
              <p className="amount remaining">₹{remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Contributions List */}
        <div className="contributions-list" style={{ margin: '1.5rem 0' }}>
          <h3>Contributors</h3>
          {contributions.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {contributions.map((c, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{c.name}</span>: ₹{c.amount.toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No contributors yet.</p>
          )}
        </div>

        {/* Sponsors List (with delete option) */}
        <div className="sponsors-list" style={{ margin: '1.5rem 0' }}>
          <h3>Sponsors</h3>
          {sponsors.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {sponsors.map((s, idx) => (
                <li key={s._id || idx} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 'bold' }}>{s.name}</span>: {s.message}
                  <button
                    style={{
                      marginLeft: 8,
                      background: '#e57373',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      padding: '2px 8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                    onClick={() => handleDeleteSponsor(s._id || s.id)}
                    title="Delete Sponsor"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No sponsors yet.</p>
          )}
        </div>

        <div className="expenses-list">
          {expenses.map((expense, idx) => (
            <div key={expense._id || expense.id || idx} className="expense-item">
              <div className="expense-icon">{getExpenseIcon(expense.category)}</div>
              <div className="expense-details">
                <h4>{expense.title}</h4>
                <p>{expense.description}</p>
                <span className="expense-date">{expense.date ? new Date(expense.date).toLocaleDateString() : ''}</span>
              </div>
              <div className="expense-amount">₹{expense.amount?.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Contribute Modal */}
        {showContributeModal && (
          <div className="modal" onClick={() => setShowContributeModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add Contribution</h3>
                <button className="modal-close" onClick={() => setShowContributeModal(false)}>×</button>
              </div>
              <form onSubmit={handleContributeSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={contributionData.name}
                    onChange={handleContributeInput}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    value={contributionData.amount}
                    onChange={handleContributeInput}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setShowContributeModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary">
                    Add Contribution
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sponsor Modal */}
        {showSponsorModal && (
          <div className="modal" onClick={() => setShowSponsorModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add Sponsor</h3>
                <button className="modal-close" onClick={() => setShowSponsorModal(false)}>×</button>
              </div>
              <form onSubmit={handleSponsorSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={sponsorData.name}
                    onChange={handleSponsorInput}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">What they sponsor / Message</label>
                  <textarea
                    name="message"
                    className="form-control"
                    value={sponsorData.message}
                    onChange={handleSponsorInput}
                    rows="2"
                    required
                  ></textarea>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setShowSponsorModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary">
                    Add Sponsor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expense Modal */}
        {showModal && (
          <div className="modal" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add New Expense</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title</label>
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
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Decorations">Decorations</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
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
                <div className="modal-actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary">
                    Add Expense
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

export default Expenses;