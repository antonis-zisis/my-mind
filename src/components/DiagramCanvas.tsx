import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { AppEdge, AppNode } from '../types';
import type { OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import ProjectNode from './nodes/ProjectNode';
import ServiceNode from './nodes/ServiceNode';

const nodeTypes = {
  project: ProjectNode,
  service: ServiceNode,
};

interface Props {
  nodes: AppNode[];
  edges: AppEdge[];
  selectedNodeId: string | null;
  compact: boolean;
  onCompactChange: (compact: boolean) => void;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<AppEdge>;
  onConnect: OnConnect;
  saveStatus: 'saved' | 'saving' | 'idle';
}

const saveLabels: Record<Props['saveStatus'], string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved',
};

export default function DiagramCanvas({
  nodes,
  edges,
  selectedNodeId,
  compact,
  onCompactChange,
  onNodesChange,
  onEdgesChange,
  onConnect,
  saveStatus,
}: Props) {
  const minimapNodeColor = useMemo(
    () => (node: AppNode) => (node.type === 'project' ? '#6366f1' : '#10b981'),
    []
  );

  const displayEdges = useMemo(() => {
    if (!selectedNodeId) return edges;
    return edges.map((edge) => {
      const isConnected =
        edge.source === selectedNodeId || edge.target === selectedNodeId;
      return isConnected ? { ...edge, className: 'edge-highlighted' } : edge;
    });
  }, [edges, selectedNodeId]);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Delete', 'Backspace']}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#2e3347"
        />
        <Panel position="top-left">
          <div className="flex items-center border border-border rounded overflow-hidden text-xs shadow-sm">
            <button
              className={`px-3 py-1.5 cursor-pointer transition-colors duration-150 ${compact ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-text'}`}
              onClick={() => onCompactChange(true)}
            >
              Compact
            </button>
            <button
              className={`px-3 py-1.5 cursor-pointer transition-colors duration-150 border-l border-border ${!compact ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-text'}`}
              onClick={() => onCompactChange(false)}
            >
              Detailed
            </button>
          </div>
        </Panel>
        <Controls />
        <MiniMap nodeColor={minimapNodeColor} maskColor="rgba(15,17,23,0.7)" />
        {saveStatus !== 'idle' && (
          <Panel position="bottom-center">
            <div
              className={`text-[11px] px-3 py-1 rounded-full font-medium tracking-wide border ${
                saveStatus === 'saving'
                  ? 'bg-surface-2 text-muted border-border'
                  : 'bg-service text-service-text border-service-border'
              }`}
            >
              {saveLabels[saveStatus]}
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
