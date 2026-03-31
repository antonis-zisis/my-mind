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

  const selectedNode = nodes.find((node) => node.selected) ?? null;
  const [compact, setCompact] = useState(
    () => localStorage.getItem('diagram-view') !== 'detailed'
  );

  function handleCompactChange(value: boolean) {
    setCompact(value);
    localStorage.setItem('diagram-view', value ? 'compact' : 'detailed');
  }

  if (diagramLoading) {
    return (
      <div className="text-muted flex h-dvh items-center justify-center text-sm">
        Loading your diagram…
      </div>
    );
  }

  return (
    <CompactContext.Provider value={compact}>
      <ReactFlowProvider>
        <div className="flex h-dvh flex-col">
          <header className="bg-surface border-border flex h-13 shrink-0 items-center justify-between border-b px-5">
            <span className="text-text text-base font-bold">
              🧠 My Mind - Infrastructure Map
            </span>
            <div className="flex items-center gap-2.5">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  className="border-border h-7 w-7 rounded-full border-2"
                />
              )}
              <span className="text-muted text-sm">
                {user?.displayName ?? user?.email}
              </span>
              <button
                className="border-border text-muted hover:border-danger hover:text-danger cursor-pointer rounded border bg-transparent px-2.5 py-1 text-xs transition-colors duration-150"
                onClick={() => signOut(auth)}
              >
                Sign out
              </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
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
