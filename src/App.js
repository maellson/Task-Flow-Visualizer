import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/processes" element={<Dashboard />} /> {/* Pode ser substituído por componente específico */}
            <Route path="/tasks" element={<Dashboard />} /> {/* Pode ser substituído por componente específico */}
            <Route path="/approvals" element={<Dashboard />} /> {/* Pode ser substituído por componente específico */}
            <Route path="/rules" element={<Dashboard />} /> {/* Pode ser substituído por componente específico */}
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;