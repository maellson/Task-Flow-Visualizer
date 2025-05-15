import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const getStatusColor = (status) => {
  switch (status) {
    case 'not_started': return '#cbd5e1';  // slate-300
    case 'in_progress': return '#3b82f6';  // blue-500
    case 'completed': return '#22c55e';    // green-500
    case 'blocked': return '#ef4444';      // red-500
    default: return '#cbd5e1';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'foundation': return '🏗️';
    case 'structure': return '🧱';
    case 'plumbing': return '🚿';
    case 'electrical': return '💡';
    case 'painting': return '🎨';
    case 'flooring': return '⬜';
    case 'finishing': return '✨';
    default: return '📋';
  }
};

const TaskNode = ({ data }) => {
  const statusColor = getStatusColor(data.status);
  const typeIcon = getTypeIcon(data.type);
  
  return (
    <div className="task-node" style={{ 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      padding: '10px',
      width: '220px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderLeft: `5px solid ${statusColor}`
    }}>
      <Handle type="target" position={Position.Left} />
      
      <div className="task-header" style={{ marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{typeIcon} {data.name}</span>
          <span style={{ 
            backgroundColor: statusColor, 
            color: 'white', 
            padding: '2px 6px', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {data.status.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <div className="task-details" style={{ fontSize: '12px' }}>
        <p><strong>Responsável:</strong> {data.responsible}</p>
        <p><strong>Local:</strong> {data.location}</p>
        <p><strong>Ordem:</strong> {data.order}</p>
        
        {data.resources && data.resources.length > 0 && (
          <div className="task-resources" style={{ marginTop: '8px' }}>
            <p><strong>Recursos:</strong></p>
            <ul style={{ paddingLeft: '15px', margin: '5px 0' }}>
              {data.resources.map((resource, idx) => (
                <li key={idx}>
                  {resource.name}: {resource.quantity} {resource.unit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(TaskNode);