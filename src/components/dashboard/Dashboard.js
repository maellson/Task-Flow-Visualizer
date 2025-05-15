import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import ProcessFlow from '../ProcessFlow';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="brand">
          <h1>Sistema de Gestão de Tarefas</h1>
        </div>
        
        <div className="user-info">
          <span>{user.first_name} {user.last_name}</span>
          <span className="user-type">({user.user_type === 'project_manager' ? 'Gerente de Projeto' : 'Usuário Regular'})</span>
          <button onClick={logout} className="logout-btn">Sair</button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-nav">
          <Link to="/processes" className="nav-link">Processos</Link>
          <Link to="/tasks" className="nav-link">Tarefas</Link>
          {user.user_type === 'project_manager' && (
            <>
              <Link to="/approvals" className="nav-link">Aprovações</Link>
              <Link to="/rules" className="nav-link">Regras de Concorrência</Link>
            </>
          )}
        </div>
        
        <div className="dashboard-main">
          <ProcessFlow />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;