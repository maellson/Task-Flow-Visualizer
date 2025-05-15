import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background,
  applyEdgeChanges,
  applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import TaskNode from './TaskNode';
import ConcurrencyPanel from './ConcurrencyPanel';

// Definição do tipo de nó personalizado
const nodeTypes = {
  taskNode: TaskNode,
};

const ProcessFlow = () => {
  const [processes, setProcesses] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [concurrencyRules, setConcurrencyRules] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [canRunConcurrently, setCanRunConcurrently] = useState(null);
  const [concurrencyReason, setConcurrencyReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const reactFlowWrapper = useRef(null);

  // Carregar lista de processos
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/processes/');
        setProcesses(response.data);
        
        // Selecionar automaticamente o primeiro processo se existir
        if (response.data.length > 0) {
          setSelectedProcessId(response.data[0].id);
        }
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar processos:', err);
        setError('Erro ao carregar processos. Verifique se o servidor está rodando.');
        setLoading(false);
      }
    };

    fetchProcesses();
  }, []);

  // Carregar dados do processo
  useEffect(() => {
    const fetchProcessData = async () => {
      if (!selectedProcessId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/processes/${selectedProcessId}/flow_data/`);
        console.log("Dados do fluxo:", response.data); // Adicionar para debug
        
        // Garantir que os nós tenham uma posição válida
        const formattedNodes = response.data.nodes.map(node => ({
          ...node,
          position: node.position || { x: Math.random() * 500, y: Math.random() * 500 }
        }));
        
        setNodes(formattedNodes);
        setEdges(response.data.edges);
        setConcurrencyRules(response.data.concurrency_rules);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do processo:', error);
        setError('Erro ao carregar dados do fluxo do processo.');
        setLoading(false);
      }
    };

    fetchProcessData();
  }, [selectedProcessId]);

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

  // Manipular mudança de processo
  const handleProcessChange = (e) => {
    setSelectedProcessId(parseInt(e.target.value));
  };

  if (loading) {
    return <div className="loading-container">Carregando...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="process-flow-container">
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
      
      <div className="flow-wrapper" ref={reactFlowWrapper}>
        {nodes.length > 0 ? (
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
        ) : (
          <div className="no-tasks">
            <p>Este processo não tem tarefas definidas.</p>
          </div>
        )}
      </div>
      
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