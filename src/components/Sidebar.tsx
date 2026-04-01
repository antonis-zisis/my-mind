import { type SubmitEvent, useState, useId } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { AppNode, NodeData } from '../types';
import NodeForm, { defaultForm } from './sidebar/NodeForm';
import EditSection from './sidebar/EditSection';

interface Props {
  onAddNode: (node: AppNode) => void;
  selectedNode: AppNode | null;
  onUpdateNode: (id: string, patch: Partial<NodeData>) => void;
}

export default function Sidebar({
  onAddNode,
  selectedNode,
  onUpdateNode,
}: Props) {
  const [addForm, setAddForm] = useState(defaultForm);
  const { screenToFlowPosition } = useReactFlow();
  const addFormId = useId();

  function handleAdd(event: SubmitEvent) {
    event.preventDefault();

    if (!addForm.label.trim()) {
      return;
    }

    const position = screenToFlowPosition({
      x: window.innerWidth / 2 + Math.random() * 100 - 50,
      y: window.innerHeight / 2 + Math.random() * 100 - 50,
    });

    const tags = addForm.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    onAddNode({
      id: `${Date.now()}`,
      type: addForm.kind,
      position,
      data: {
        label: addForm.label.trim(),
        kind: addForm.kind,
        description: addForm.description.trim() || undefined,
        url: addForm.url.trim() || undefined,
        tags: tags.length ? tags : undefined,
      },
    });
    setAddForm(defaultForm);
  }

  return (
    <aside className="bg-surface border-border flex w-60 shrink-0 flex-col gap-5 overflow-y-auto border-r p-5">
      {selectedNode ? (
        <EditSection
          key={selectedNode.id}
          selectedNode={selectedNode}
          onUpdateNode={onUpdateNode}
        />
      ) : (
        <>
          <h2 className="text-muted m-0 text-xs font-semibold tracking-widest uppercase">
            Add node
          </h2>
          <NodeForm
            formId={addFormId}
            form={addForm}
            setForm={setAddForm}
            onSubmit={handleAdd}
            submitLabel="+ Add node"
          />
        </>
      )}

      <div className="text-muted mt-auto text-[11px] leading-relaxed [&>p]:m-0">
        <p>Drag nodes to rearrange.</p>
        <p>Connect by dragging from a handle.</p>
        <p>Click to select, then edit above.</p>
        <p>Select + Delete to remove.</p>
      </div>
    </aside>
  );
}
