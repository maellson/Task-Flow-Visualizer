import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import TaskNode from './TaskNode';
import ConcurrencyPanel from './ConcurrencyPanel';

const nodeTypes = {
  taskNode: TaskNode,
};

const ProcessFlow = ({ processId }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [concurrencyRules, setConcurrencyRules] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [canRunConcurrently, setCanRunConcurrently] = useState(null);
  const [concurrencyReason, setConcurrencyReason] = useState('');

  // Carregar dados do processo
  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/processes/${processId}/flow_data/`);
        setNodes(response.data.nodes);
        setEdges(response.data.edges);
        setConcurrencyRules(response.data.concurrency_rules);
      } catch (error) {
        console.error('Erro ao carregar dados do processo:', error);
      }
    };

    if (processId) {
      fetchProcessData();
    }
  }, [processId]);

  // Manipular seleção de nós
  const onSelectionChange = useCallback(({ nodes }) => {
    setSelectedNodes(nodes);
    
    // Verificar concorrência quando exatamente 2 nós estão selecionados
    if (nodes.length === 2) {
      checkConcurrency(nodes[0].data.id, nodes[1].data.id);
    } else {
      setCanRunConcurrently(null);
      setConcurrencyReason('');
    }
  }, []);

  // Verificar se as tarefas podem ser executadas concorrentemente
  const checkConcurrency = async (task1Id, task2Id) => {
    try {
      const response = await axios.post('http://localhost:8000/api/tasks/can_run_concurrently/', {
        task1_id: task1Id,
        task2_id: task2Id
      });
      
      setCanRunConcurrently(response.data.can_run_concurrently);
      setConcurrencyReason(response.data.reason);
    } catch (error) {
      console.error('Erro ao verificar concorrência:', error);
      setCanRunConcurrently(false);
      setConcurrencyReason('Erro ao verificar concorrência');
    }
  };

  // Manipular alterações nos nós (arrastar, etc.)
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Manipular alterações nas arestas
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      
      {/* Painel de informações sobre concorrência */}
      <ConcurrencyPanel 
        selectedNodes={selectedNodes}
        canRunConcurrently={canRunConcurrently}
        concurrencyReason={concurrencyReason}
        concurrencyRules={concurrencyRules}
      />
    </div>
  );
};

export default ProcessFlow;