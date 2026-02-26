import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { ReactFlowProvider } from '@xyflow/react';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useDiagram } from '../hooks/useDiagram';
import { CompactContext } from '../contexts/CompactContext';
import DiagramCanvas from '../components/DiagramCanvas';
import Sidebar from '../components/Sidebar';

export default function DiagramPage() {
  const { user } = useAuth();
  const uid = user!.uid;

  const {
    nodes,
    edges,
    diagramLoading,
    saveStatus,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
  } = useDiagram(uid);

  const selectedNode = nodes.find((n) => n.selected) ?? null;
  const [compact, setCompact] = useState(
    () => localStorage.getItem('diagram-view') !== 'detailed'
  );

  function handleCompactChange(value: boolean) {
    setCompact(value);
    localStorage.setItem('diagram-view', value ? 'compact' : 'detailed');
  }

  if (diagramLoading) {
    return (
      <div className="h-dvh flex items-center justify-center text-sm text-muted">
        Loading your diagram…
      </div>
    );
  }

  return (
    <CompactContext.Provider value={compact}>
      <ReactFlowProvider>
        <div className="h-dvh flex flex-col">
          <header className="h-[52px] shrink-0 bg-surface border-b border-border flex items-center justify-between px-5">
            <span className="text-base font-bold text-text">
              🧠 My Mind - Infrastructure Map
            </span>
            <div className="flex items-center gap-2.5">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-7 h-7 rounded-full border-2 border-border"
                />
              )}
              <span className="text-sm text-muted">
                {user?.displayName ?? user?.email}
              </span>
              <button
                className="text-xs px-2.5 py-1 bg-transparent border border-border text-muted rounded hover:border-danger hover:text-danger transition-colors duration-150 cursor-pointer"
                onClick={() => signOut(auth)}
              >
                Sign out
              </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              onAddNode={addNode}
              selectedNode={selectedNode}
              onUpdateNode={updateNode}
            />
            <DiagramCanvas
              nodes={nodes}
              edges={edges}
              selectedNodeId={selectedNode?.id ?? null}
              compact={compact}
              onCompactChange={handleCompactChange}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              saveStatus={saveStatus}
            />
          </div>
        </div>
      </ReactFlowProvider>
    </CompactContext.Provider>
  );
}
