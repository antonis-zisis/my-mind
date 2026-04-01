import { useCallback, useRef, useState } from 'react';
import { signOut } from 'firebase/auth';
import { ReactFlowProvider } from '@xyflow/react';
import type { OnBeforeDelete } from '@xyflow/react';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useDiagram } from '../hooks/useDiagram';
import { CompactContext } from '../contexts/CompactContext';
import DiagramCanvas from '../components/DiagramCanvas';
import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';
import type { AppEdge, AppNode } from '../types';

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

  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const handleBeforeDelete: OnBeforeDelete<AppNode, AppEdge> = useCallback(
    ({ nodes: deletedNodes }) => {
      if (deletedNodes.length === 0) {
        return Promise.resolve(true);
      }

      const name =
        deletedNodes.length === 1
          ? `"${deletedNodes[0].data.label}"`
          : `${deletedNodes.length} nodes`;

      setConfirmMessage(`Delete ${name}? This cannot be undone.`);

      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;
      });
    },
    []
  );

  function handleConfirm() {
    setConfirmMessage(null);
    resolveRef.current?.(true);
    resolveRef.current = null;
  }

  function handleCancel() {
    setConfirmMessage(null);
    resolveRef.current?.(false);
    resolveRef.current = null;
  }

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
              My Mind - Infrastructure Map
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
              onBeforeDelete={handleBeforeDelete}
              saveStatus={saveStatus}
            />
          </div>
        </div>

        {confirmMessage && (
          <ConfirmDialog
            message={confirmMessage}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </ReactFlowProvider>
    </CompactContext.Provider>
  );
}
