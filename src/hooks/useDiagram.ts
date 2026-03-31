import { useCallback, useEffect, useRef, useState } from 'react';
import { addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import type { Connection } from '@xyflow/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type {
  AppEdge,
  AppNode,
  SerializedEdge,
  SerializedNode,
} from '../types';

const SAVE_DELAY_MS = 1500;

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
}

function serializeNodes(nodes: AppNode[]): SerializedNode[] {
  return nodes.map(({ id, type = 'service', position, data }) => ({
    id,
    type,
    position,
    data: stripUndefined(data) as typeof data,
  }));
}

function serializeEdges(edges: AppEdge[]): SerializedEdge[] {
  return edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
    id,
    source,
    target,
    sourceHandle: sourceHandle ?? null,
    targetHandle: targetHandle ?? null,
  }));
}

export function useDiagram(uid: string) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  const [diagramLoading, setDiagramLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>(
    'idle'
  );

  // skip the auto-save triggered by the initial load
  const skipSave = useRef(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef({ nodes, edges });

  useEffect(() => {
    latestRef.current = { nodes, edges };
  });

  // load from Firestore on mount
  useEffect(() => {
    const diagramRef = doc(db, 'diagrams', uid);
    getDoc(diagramRef)
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          // set skipSave before triggering state updates so the
          // subsequent effect run (caused by these updates) is skipped.
          skipSave.current = true;
          setNodes((data.nodes ?? []) as AppNode[]);
          setEdges((data.edges ?? []) as AppEdge[]);
        } else {
          // no existing diagram — allow saves immediately
          skipSave.current = false;
        }
      })
      .catch(console.error)
      .finally(() => setDiagramLoading(false));
  }, [uid, setNodes, setEdges]);

  // auto-save whenever nodes/edges change (debounced)
  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      setSaveStatus('saving');
      const { nodes: latestNodes, edges: latestEdges } = latestRef.current;
      const diagramRef = doc(db, 'diagrams', uid);
      setDoc(diagramRef, {
        nodes: serializeNodes(latestNodes),
        edges: serializeEdges(latestEdges),
        updatedAt: Date.now(),
      })
        .then(() => setSaveStatus('saved'))
        .catch(console.error);
    }, SAVE_DELAY_MS);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [nodes, edges, uid]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = useCallback(
    (node: AppNode) => setNodes((nds) => [...nds, node]),
    [setNodes]
  );

  const updateNode = useCallback(
    (id: string, patch: Partial<AppNode['data']>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== id) {
            return node;
          }

          return {
            ...node,
            // keep node.type in sync when kind changes
            type: patch.kind ?? node.data.kind,
            data: { ...node.data, ...patch },
          };
        })
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
    },
    [setNodes, setEdges]
  );

  return {
    nodes,
    edges,
    diagramLoading,
    saveStatus,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    deleteNode,
  };
}
