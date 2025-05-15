import React from 'react';

const ConcurrencyPanel = ({ 
  selectedNodes, 
  canRunConcurrently, 
  concurrencyReason,
  concurrencyRules 
}) => {
  if (selectedNodes.length !== 2) {
    return (
      <div className="concurrency-panel" style={panelStyle}>
        <h3>Verificação de Concorrência</h3>
        <p>Selecione exatamente 2 tarefas para verificar se podem ser executadas concorrentemente.</p>
        
        {concurrencyRules.length > 0 && (
          <div className="rules-section">
            <h4>Regras de Concorrência Ativas:</h4>
            <ul>
              {concurrencyRules.map(rule => (
                <li key={rule.id}>
                  <strong>{rule.name}</strong> ({rule.type}): {rule.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const task1 = selectedNodes[0].data;
  const task2 = selectedNodes[1].data;

  return (
    <div className="concurrency-panel" style={panelStyle}>
      <h3>Verificação de Concorrência</h3>
      
      <div className="selected-tasks">
        <p><strong>Tarefas selecionadas:</strong></p>
        <ul>
          <li>{task1.name} (Responsável: {task1.responsible})</li>
          <li>{task2.name} (Responsável: {task2.responsible})</li>
        </ul>
      </div>
      
      {canRunConcurrently !== null && (
        <div className="result" style={{
          backgroundColor: canRunConcurrently ? '#f0fdf4' : '#fef2f2',
          padding: '10px',
          borderRadius: '5px',
          marginTop: '10px',
          borderLeft: `4px solid ${canRunConcurrently ? '#22c55e' : '#ef4444'}`
        }}>
          <p>
            <strong>Resultado:</strong> As tarefas {canRunConcurrently ? 'podem' : 'não podem'} ser executadas concorrentemente.
          </p>
          <p><strong>Razão:</strong> {concurrencyReason}</p>
        </div>
      )}
    </div>
  );
};

const panelStyle = {
  padding: '15px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  margin: '20px 0',
  maxWidth: '800px',
};

export default ConcurrencyPanel;