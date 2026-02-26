import { useState, useId, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { NodeKind, AppNode, NodeData } from '../types';

interface Props {
  onAddNode: (node: AppNode) => void;
  selectedNode: AppNode | null;
  onUpdateNode: (id: string, patch: Partial<NodeData>) => void;
}

const defaultForm = {
  label: '',
  kind: 'service' as NodeKind,
  description: '',
  url: '',
};

const inputClass =
  'w-full px-2.5 py-1.5 text-[13px] bg-surface-2 border border-border text-text rounded focus:outline-none focus:border-primary';

function NodeForm({
  formId,
  form,
  setForm,
  onSubmit,
  submitLabel,
}: {
  formId: string;
  form: typeof defaultForm;
  setForm: React.Dispatch<React.SetStateAction<typeof defaultForm>>;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted" htmlFor={`${formId}-label`}>
          Name *
        </label>
        <input
          id={`${formId}-label`}
          className={inputClass}
          value={form.label}
          onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          placeholder="e.g. Personal Website"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted" htmlFor={`${formId}-kind`}>
          Type
        </label>
        <select
          id={`${formId}-kind`}
          className={inputClass}
          value={form.kind}
          onChange={(e) =>
            setForm((f) => ({ ...f, kind: e.target.value as NodeKind }))
          }
        >
          <option value="project">Project</option>
          <option value="service">Service / Tool</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted" htmlFor={`${formId}-description`}>
          Description
        </label>
        <input
          id={`${formId}-description`}
          className={inputClass}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Optional short note"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted" htmlFor={`${formId}-url`}>
          URL
        </label>
        <input
          id={`${formId}-url`}
          type="url"
          className={inputClass}
          value={form.url}
          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          placeholder="https://…"
        />
      </div>

      <button
        type="submit"
        className="mt-1 px-3 py-2 bg-primary text-white font-semibold text-[13px] rounded hover:bg-primary-light transition-colors duration-150 cursor-pointer border-none"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export default function Sidebar({
  onAddNode,
  selectedNode,
  onUpdateNode,
}: Props) {
  const [addForm, setAddForm] = useState(defaultForm);
  const [editForm, setEditForm] = useState(defaultForm);
  const { screenToFlowPosition } = useReactFlow();
  const addFormId = useId();
  const editFormId = useId();

  // Sync edit form whenever a different node is selected
  useEffect(() => {
    if (!selectedNode) return;
    setEditForm({
      label: selectedNode.data.label,
      kind: selectedNode.data.kind,
      description: selectedNode.data.description ?? '',
      url: selectedNode.data.url ?? '',
    });
  }, [selectedNode?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.label.trim()) return;

    const position = screenToFlowPosition({
      x: window.innerWidth / 2 + Math.random() * 100 - 50,
      y: window.innerHeight / 2 + Math.random() * 100 - 50,
    });

    onAddNode({
      id: `${Date.now()}`,
      type: addForm.kind,
      position,
      data: {
        label: addForm.label.trim(),
        kind: addForm.kind,
        description: addForm.description.trim() || undefined,
        url: addForm.url.trim() || undefined,
      } satisfies NodeData,
    });
    setAddForm(defaultForm);
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedNode || !editForm.label.trim()) return;
    onUpdateNode(selectedNode.id, {
      label: editForm.label.trim(),
      kind: editForm.kind,
      description: editForm.description.trim() || undefined,
      url: editForm.url.trim() || undefined,
    });
  }

  return (
    <aside className="w-60 shrink-0 bg-surface border-r border-border p-5 flex flex-col gap-5 overflow-y-auto">
      {selectedNode ? (
        <>
          <div>
            <h2 className="m-0 text-[11px] font-semibold uppercase tracking-widest text-muted">
              Edit node
            </h2>
            <p className="mt-1 mb-0 text-[11px] text-muted truncate">
              {selectedNode.data.label}
            </p>
          </div>
          <NodeForm
            formId={editFormId}
            form={editForm}
            setForm={setEditForm}
            onSubmit={handleUpdate}
            submitLabel="Update node"
          />
          <div className="border-t border-border pt-4">
            <h2 className="m-0 text-[11px] font-semibold uppercase tracking-widest text-muted">
              Add node
            </h2>
          </div>
          <NodeForm
            formId={addFormId}
            form={addForm}
            setForm={setAddForm}
            onSubmit={handleAdd}
            submitLabel="+ Add node"
          />
        </>
      ) : (
        <>
          <h2 className="m-0 text-[11px] font-semibold uppercase tracking-widest text-muted">
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

      <div className="mt-auto text-[11px] text-muted leading-relaxed [&>p]:m-0">
        <p>Drag nodes to rearrange.</p>
        <p>Connect by dragging from a handle.</p>
        <p>Click to select, then edit above.</p>
        <p>Select + Delete to remove.</p>
      </div>
    </aside>
  );
}
