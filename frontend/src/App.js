import React, { useState, useEffect } from 'react';
import './App.css';
import WelcomeOverlay from './components/WelcomeOverlay';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Planner from './components/Planner';
import Gallery from './components/Gallery';
import Chat from './components/Chat';
import FloatingPetals from './components/FloatingPetals';
import DiyaFlames from './components/DiyaFlames';
import Profile from './components/Profile';
import Login from './components/Login';
import Info from './components/Info';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || { name: "Guest" });
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);
  const [team, setTeam] = useState([]);

  // Show welcome overlay for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all shared data after login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user && user.name !== "Guest" && token) {
      fetch('http://localhost:5000/api/shared/expenses', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json()).then(setExpenses).catch(() => setExpenses([]));
      fetch('http://localhost:5000/api/shared/tasks', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json()).then(setTasks).catch(() => setTasks([]));
      fetch('http://localhost:5000/api/shared/gallery', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json()).then(setGallery).catch(() => setGallery([]));
      fetch('http://localhost:5000/api/users/team', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json()).then(setTeam).catch(() => setTeam([]));
    }
  }, [user]);

  // Fetch profile (optional, for up-to-date info)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user && user.name !== "Guest" && token) {
      fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser({ name: "Guest" }));
    }
    // eslint-disable-next-line
  }, [user]);

  const addExpense = (expense) => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/shared/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(expense)
    })
      .then(res => res.json())
      .then(setExpenses);
  };

  const addTask = (task) => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/shared/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(task)
    })
      .then(res => res.json())
      .then(setTasks);
  };

  const addGalleryImage = (image) => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/shared/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(image)
    })
      .then(res => res.json())
      .then(setGallery);
  };

  // Update task status and sync with backend
  const updateTaskStatus = (taskId, newStatus) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/shared/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(tasks =>
          tasks.map(task =>
            (task._id === updatedTask._id || task.id === updatedTask._id)
              ? { ...task, status: updatedTask.status }
              : task
          )
        );
      });
  };

  const addMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      sender: "You",
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "YU"
    };
    setMessages([...messages, newMessage]);
  };

  const handleLogout = () => {
    setUser({ name: "Guest" });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentSection('dashboard');
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard expenses={expenses} tasks={tasks} team={team}/>;
      case 'expenses':
        return <Expenses expenses={expenses} onAddExpense={addExpense} />;
      case 'planner':
        return <Planner tasks={tasks} onAddTask={addTask} onUpdateTaskStatus={updateTaskStatus} team={team} user={user} />;
      case 'gallery':
        return <Gallery gallery={gallery} onAddGalleryImage={addGalleryImage} />;
      case 'chat':
        return <Chat messages={messages} onAddMessage={addMessage} />;
      case 'profile':
        return <Profile user={user} expenses={expenses} tasks={tasks} onLogout={handleLogout} />;
      case 'info':
        return <Info />;
      default:
        return <Dashboard expenses={expenses} tasks={tasks} />;
    }
  };

  // Show login page if not logged in
  if (!user || !user.name || user.name === "Guest") {
    return <Login />;
  }

  return (
    <div className="App">
      <FloatingPetals />

      {showWelcome && <WelcomeOverlay />}

      <Navigation
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {renderCurrentSection()}
      </main>

      <DiyaFlames />
    </div>
  );
}

export default App;