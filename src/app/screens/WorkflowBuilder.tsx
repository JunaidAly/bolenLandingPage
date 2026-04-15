import '@xyflow/react/dist/style.css';

import { memo, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  Panel,
  ConnectionMode,
} from '@xyflow/react';
import { Play, Save, Pause } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export type WorkflowKind = 'trigger' | 'condition' | 'ai' | 'crm' | 'notification';

export type WorkflowNodeData = {
  kind: WorkflowKind;
  label: string;
  color: string;
};

const nodeTypeLabels: Record<WorkflowKind, string> = {
  trigger: 'Trigger',
  condition: 'Condition',
  ai: 'AI Action',
  crm: 'CRM Action',
  notification: 'Notification',
};

const defaultLabels: Record<string, string> = {
  trigger: 'New Trigger',
  condition: 'New Condition',
  ai: 'New AI Step',
  crm: 'New CRM Step',
  notification: 'New Notification',
};

const kindColors: Record<string, string> = {
  trigger: '#3b82f6',
  condition: '#f59e0b',
  ai: '#7c3aed',
  crm: '#10b981',
  notification: '#f97316',
};

const initialNodes: Node<WorkflowNodeData>[] = [
  {
    id: '1',
    type: 'workflow',
    position: { x: 80, y: 160 },
    data: { kind: 'trigger', label: 'Deal Stage Changed', color: '#3b82f6' },
  },
  {
    id: '2',
    type: 'workflow',
    position: { x: 300, y: 160 },
    data: { kind: 'condition', label: 'Stage = Stalled?', color: '#f59e0b' },
  },
  {
    id: '3',
    type: 'workflow',
    position: { x: 520, y: 100 },
    data: { kind: 'ai', label: 'Analyze Deal Health', color: '#7c3aed' },
  },
  {
    id: '4',
    type: 'workflow',
    position: { x: 740, y: 100 },
    data: { kind: 'ai', label: 'Generate Email Draft', color: '#7c3aed' },
  },
  {
    id: '5',
    type: 'workflow',
    position: { x: 520, y: 240 },
    data: { kind: 'crm', label: 'Update Deal Notes', color: '#10b981' },
  },
  {
    id: '6',
    type: 'workflow',
    position: { x: 940, y: 160 },
    data: { kind: 'notification', label: 'Notify Rep', color: '#f97316' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', sourceHandle: 'out', targetHandle: 'in' },
  { id: 'e2-3', source: '2', target: '3', sourceHandle: 'yes', targetHandle: 'in', label: 'Yes' },
  { id: 'e2-5', source: '2', target: '5', sourceHandle: 'no', targetHandle: 'in', label: 'No' },
  { id: 'e3-4', source: '3', target: '4', sourceHandle: 'out', targetHandle: 'in' },
  { id: 'e4-6', source: '4', target: '6', sourceHandle: 'out', targetHandle: 'in' },
  { id: 'e5-6', source: '5', target: '6', sourceHandle: 'out', targetHandle: 'in' },
];

const handleClass =
  '!h-3 !w-3 !min-h-0 !min-w-0 !border-2 !border-[#08090f] !rounded-full !transform-none';

const WorkflowNode = memo(function WorkflowNode({ data, selected }: NodeProps<Node<WorkflowNodeData>>) {
  const cat = nodeTypeLabels[data.kind];
  const letter = cat.charAt(0);

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className={`${handleClass} !bg-[#7c3aed]`}
        isConnectable
      />
      <div
        className={`w-[148px] rounded-xl border border-white/10 bg-white/5 p-3.5 shadow-lg backdrop-blur-sm transition-[box-shadow,background-color] ${
          selected ? 'border-[#3b82f6]/60 bg-white/[0.08] ring-2 ring-[#3b82f6]/40' : 'hover:border-white/20 hover:bg-white/[0.07]'
        }`}
        style={{ boxShadow: `0 0 0 1px ${data.color}33` }}
      >
        <div
          className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold"
          style={{ backgroundColor: `${data.color}28`, color: data.color }}
        >
          {letter}
        </div>
        <div className="mb-0.5 text-sm font-medium leading-snug text-white">{data.label}</div>
        <div className="text-xs text-white/45">{cat}</div>
      </div>

      {data.kind === 'condition' ? (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="yes"
            style={{ top: '32%' }}
            className={`${handleClass} !bg-emerald-500`}
            isConnectable
          />
          <Handle
            type="source"
            position={Position.Right}
            id="no"
            style={{ top: '68%' }}
            className={`${handleClass} !bg-amber-500`}
            isConnectable
          />
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          className={`${handleClass} !bg-[#3b82f6]`}
          isConnectable
        />
      )}
    </div>
  );
});

const nodeTypes = { workflow: WorkflowNode };

function AddNodePanel({
  setNodes,
}: {
  setNodes: React.Dispatch<React.SetStateAction<Node<WorkflowNodeData>[]>>;
}) {
  const { screenToFlowPosition } = useReactFlow();

  const addNode = useCallback(
    (type: string) => {
      const color = kindColors[type] ?? '#3b82f6';
      const kind = type as WorkflowKind;
      const id = `n-${Date.now()}`;
      const position = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      setNodes((nds) => [
        ...nds,
        {
          id,
          type: 'workflow',
          position,
          data: {
            kind,
            label: defaultLabels[type] ?? 'New Node',
            color,
          },
        },
      ]);
      toast.success('Node added', { description: nodeTypeLabels[kind] ?? type });
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <Panel position="bottom-center" className="!m-0 w-full max-w-full px-3 pb-2 sm:px-4">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0d0e1a]/95 px-3 py-2.5 shadow-xl backdrop-blur-xl sm:gap-3 sm:px-4">
        <span className="w-full text-center text-xs text-white/50 sm:mr-1 sm:w-auto sm:text-left sm:text-sm">
          Drag nodes · Connect handles · Add:
        </span>
        {Object.entries(nodeTypeLabels).map(([type, label]) => (
          <button
            key={type}
            type="button"
            onClick={() => addNode(type)}
            className="flex min-h-11 touch-manipulation items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 active:bg-white/15"
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: kindColors[type] }} />
            {label}
          </button>
        ))}
      </div>
    </Panel>
  );
}

function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: 'rgba(59,130,246,0.55)', strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'smoothstep' as const,
      animated: false,
      style: { stroke: 'rgba(99,102,241,0.45)', strokeWidth: 2 },
    }),
    []
  );

  return (
    <div className="h-full min-h-[420px] w-full min-w-0 sm:min-h-[480px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.35}
        maxZoom={1.5}
        deleteKeyCode={['Backspace', 'Delete']}
        snapToGrid
        snapGrid={[16, 16]}
        className="bg-[#08090f]"
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="rgba(255,255,255,0.05)" />
        <Controls
          className="!m-2 !overflow-hidden !rounded-xl !border !border-white/10 !bg-[#0d0e1a]/95 !shadow-lg"
          showInteractive={false}
        />
        <AddNodePanel setNodes={setNodes} />
      </ReactFlow>
    </div>
  );
}

export function WorkflowBuilder() {
  const [isActive, setIsActive] = useState(true);

  return (
    <ReactFlowProvider>
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 border-b border-white/5 bg-[#0d0e1a]/50 px-4 py-2 backdrop-blur-xl sm:px-6 lg:px-8 lg:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-4">
              <input
                type="text"
                defaultValue="Stalled Deal Recovery"
                className="min-w-0 flex-1 rounded-lg border-none bg-transparent px-2 py-2 text-lg outline-none focus:bg-white/5 sm:py-1 sm:text-xl"
                aria-label="Workflow name"
              />
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                  isActive
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/10 bg-white/5 text-white/40'
                }`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-white/40'}`} />
                {isActive ? 'Active' : 'Paused'}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsActive(!isActive);
                  toast.info(isActive ? 'Workflow paused' : 'Workflow activated');
                }}
                className="flex min-h-11 touch-manipulation items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition-colors hover:bg-white/10 active:bg-white/15 sm:px-4"
              >
                {isActive ? <Pause size={16} /> : <Play size={16} />}
                {isActive ? 'Pause' : 'Activate'}
              </button>
              <button
                type="button"
                onClick={() => toast.success('Workflow saved', { description: 'Stalled Deal Recovery' })}
                className="flex min-h-11 touch-manipulation items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm transition-colors hover:bg-white/15 active:bg-white/20 sm:px-4"
              >
                <Save size={16} />
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.loading('Running test…', { id: 'wf-test' });
                  setTimeout(() => {
                    toast.success('Test run completed', {
                      id: 'wf-test',
                      description: 'All nodes executed successfully (demo).',
                    });
                  }, 1200);
                }}
                className="flex min-h-11 touch-manipulation items-center gap-2 rounded-xl bg-[#3b82f6] px-3 py-2 text-sm transition-colors hover:bg-[#3b82f6]/90 active:bg-[#3b82f6]/80 sm:px-4"
              >
                <Play size={16} />
                Test Run
              </button>
            </div>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <WorkflowCanvas />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
