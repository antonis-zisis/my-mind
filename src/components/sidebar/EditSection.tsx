import { type SubmitEvent, useState, useId } from 'react';
import type { AppNode, NodeData } from '../../types';
import NodeForm, { defaultForm } from './NodeForm';

interface Props {
  selectedNode: AppNode;
  onUpdateNode: (id: string, patch: Partial<NodeData>) => void;
}

export default function EditSection({ selectedNode, onUpdateNode }: Props) {
  const editFormId = useId();
  const [editForm, setEditForm] = useState({
    ...defaultForm,
    label: selectedNode.data.label,
    kind: selectedNode.data.kind,
    description: selectedNode.data.description ?? '',
    url: selectedNode.data.url ?? '',
    tags: selectedNode.data.tags?.join(', ') ?? '',
  });

  function handleUpdate(event: SubmitEvent) {
    event.preventDefault();

    if (!editForm.label.trim()) {
      return;
    }

    const tags = editForm.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    onUpdateNode(selectedNode.id, {
      label: editForm.label.trim(),
      kind: editForm.kind,
      description: editForm.description.trim() || undefined,
      url: editForm.url.trim() || undefined,
      tags: tags.length ? tags : undefined,
    });
  }

  return (
    <>
      <div className="flex min-w-0 items-baseline gap-1.5">
        <h2 className="text-muted m-0 shrink-0 truncate text-xs font-semibold tracking-widest uppercase">
          Edit {selectedNode.data.label}
        </h2>
      </div>

      <NodeForm
        formId={editFormId}
        form={editForm}
        setForm={setEditForm}
        onSubmit={handleUpdate}
        submitLabel="Update node"
      />
    </>
  );
}
