import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('Tasks');
  const [taskInput, setTaskInput] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Optimize enterprise DB query indexing performance', priority: 'High', completed: false, createdAt: '10:00 AM' },
    { id: 2, name: 'Review architectural system design blueprint docs', priority: 'Medium', completed: true, createdAt: '11:15 AM' },
    { id: 3, name: 'Conduct code review on module branch deployment', priority: 'Low', completed: false, createdAt: '01:30 PM' }
  ]);

  // Dynamically captures today's current date
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setTasks([{ id: Date.now(), name: taskInput, priority, completed: false, createdAt: timeString }, ...tasks]);
    setTaskInput('');
    setPriority('Medium');
  };

  const saveEdit = (id) => {
    if (!editingName.trim()) return;
    setTasks(tasks.map(t => t.id === id ? { ...t, name: editingName } : t));
    setEditingId(null);
    setEditingName('');
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Done') return t.completed;
    return true;
  });

  return (
    <div className="app-workspace">
      <nav className="global-navbar">
        <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="nav-brand" onClick={() => setCurrentView('Home')} style={{ cursor: 'pointer' }}>
            <span className="brand-text">TaskFlow </span>
          </div>

          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button className={`nav-link-item ${currentView === 'Home' ? 'is-link-active' : ''}`} onClick={() => setCurrentView('Home')}>Home</button>
            <button className={`nav-link-item ${currentView === 'Tasks' ? 'is-link-active' : ''}`} onClick={() => setCurrentView('Tasks')}>Tasks</button>
            <button className={`nav-link-item ${currentView === 'About' ? 'is-link-active' : ''}`} onClick={() => setCurrentView('About')}>About</button>

            {/* Task Progress Circle Indicator */}
            <div className="progress-circle-container" style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="lawngreen"
                  strokeWidth="3"
                  strokeDasharray={`${completionPercentage}, 100`}
                  style={{ transition: 'stroke-dasharray 0.3s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', fontSize: '10px', fontWeight: 'bold' }}>
                {completionPercentage}%
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content-area">
        <div className="content-wrapper">
          {currentView === 'Home' && (
            <div className="view-panelfade">
              <h1>Welcome Back,</h1>
              <p className="current-date">{currentDate}</p>
              <div className="home-dashboard-grid" style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <div><h3>Pending Tasks</h3><p>{totalTasks - completedTasksCount}</p></div>
                <div><h3>Completed Tasks</h3><p>{completedTasksCount}</p></div>
                <div><h3>Task Progressing</h3><p>{completionPercentage}%</p></div>
              </div>
              <button onClick={() => setCurrentView('Tasks')} style={{ backgroundColor: 'lawngreen', color: '#000', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Get Started →
              </button>
            </div>
          )}

          {currentView === 'Tasks' && (
            <div className="view-panelfade">
              <h2>Tasks Workspace</h2>
              <p>{currentDate} | Sprint Completion: {completionPercentage}%</p>

              <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                <input type="text" placeholder="Identify next operational task..." value={taskInput} onChange={(e) => setTaskInput(e.target.value)} required />
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                <button type="submit">+ Add Task</button>
              </form>

              <div className="toolbar" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <button onClick={() => setFilter('All')}>All ({totalTasks})</button>
                <button onClick={() => setFilter('Active')}>Active ({totalTasks - completedTasksCount})</button>
                <button onClick={() => setFilter('Done')}>Completed ({completedTasksCount})</button>
                {completedTasksCount > 0 && <button onClick={() => setTasks(tasks.filter(t => !t.completed))}>Delete Done Tasks</button>}
              </div>

              <div className="data-table-view">
                {filteredTasks.length === 0 ? <p>No operational items logged.</p> : filteredTasks.map(task => (
                  <div key={task.id} className={`data-row-card ${task.completed ? 'row-is-completed' : ''}`} style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '10px 0' }}>
                    <input type="checkbox" checked={task.completed} onChange={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))} />
                    {editingId === task.id ? (
                      <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)} autoFocus />
                    ) : (
                      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.name}</span>
                    )}
                    <span>{task.priority}</span>
                    <span>{task.createdAt}</span>
                    <div>
                      {editingId === task.id ? (
                        <button onClick={() => saveEdit(task.id)}>Confirm</button>
                      ) : (
                        <button onClick={() => { setEditingId(task.id); setEditingName(task.name); }} disabled={task.completed}>Modify</button>
                      )}
                      <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'About' && (
            <div className="view-panelfade">
              <h2>This is a TaskFlow Application.</h2>
              <p>
                This TaskFlow app developed by MUGISHA Gilbert in order to track task progresses and make plan more achievable.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer style={{ marginTop: '40px', fontSize: '12px', opacity: 0.7 }}>
        © {new Date().getFullYear()} TaskFlow Systems. Secure Your Day Plans.
      </footer>
    </div>
  );
}
