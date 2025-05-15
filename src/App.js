import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProcessFlow from './components/ProcessFlow';
import './App.css';

function App() {
  const [processes, setProcesses] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchProcesses = async () => {
    try {
      console.log('Tentando acessar: http://localhost:8000/api/processes/');
      const response = await axios.get('http://localhost:8000/api/processes/');
      console.log('Resposta:', response);
      setProcesses(response.data);
      setLoading(false);
      
      if (response.data.length > 0) {
        setSelectedProcessId(response.data[0].id);
      }
    } catch (err) {
      console.error('Erro detalhado:', err);
      setError(`Erro ao carregar processos: ${err.message}`);
      setLoading(false);
    }
  };

  fetchProcesses();
}, []);

  const handleProcessChange = (e) => {
    setSelectedProcessId(parseInt(e.target.value));
  };

  if (loading) {
    return <div className="app-container">Carregando processos...</div>;
  }

  if (error) {
    return <div className="app-container error">{error}</div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Visualizador de Processos e Tarefas</h1>
        
        <div className="process-selector">
          <label htmlFor="process-select">Selecione um processo: </label>
          <select 
            id="process-select"
            value={selectedProcessId || ''}
            onChange={handleProcessChange}
          >
            <option value="" disabled>Selecione um processo</option>
            {processes.map(process => (
              <option key={process.id} value={process.id}>
                {process.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="flow-container">
        {selectedProcessId ? (
          <ProcessFlow processId={selectedProcessId} />
        ) : (
          <div className="no-process">
            <p>Nenhum processo selecionado ou disponível.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;