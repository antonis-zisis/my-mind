import { useState, useId } from 'react';
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
  tags: '',
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
  onSubmit: (event: React.FormEvent) => void;
  submitLabel: string;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-muted text-xs" htmlFor={`${formId}-label`}>
          Name *
        </label>
        <input
          id={`${formId}-label`}
          className={inputClass}
          value={form.label}
          onChange={(event) =>
            setForm((func) => ({ ...func, label: event.target.value }))
          }
          placeholder="e.g. Personal Website"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-muted text-xs" htmlFor={`${formId}-kind`}>
          Type
        </label>
        <select
          id={`${formId}-kind`}
          className={inputClass}
          value={form.kind}
          onChange={(event) =>
            setForm((func) => ({
              ...func,
              kind: event.target.value as NodeKind,
            }))
          }
        >
          <option value="project">Project</option>
          <option value="service">Service / Tool</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-muted text-xs" htmlFor={`${formId}-description`}>
          Description
        </label>
        <input
          id={`${formId}-description`}
          className={inputClass}
          value={form.description}
          onChange={(event) =>
            setForm((func) => ({ ...func, description: event.target.value }))
          }
          placeholder="Optional short note"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-muted text-xs" htmlFor={`${formId}-url`}>
          URL
        </label>
        <input
          id={`${formId}-url`}
          type="url"
          className={inputClass}
          value={form.url}
          onChange={(event) =>
            setForm((func) => ({ ...func, url: event.target.value }))
          }
          placeholder="https://…"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-muted text-xs" htmlFor={`${formId}-tags`}>
          Tags
        </label>
        <input
          id={`${formId}-tags`}
          className={inputClass}
          value={form.tags}
          onChange={(event) =>
            setForm((func) => ({ ...func, tags: event.target.value }))
          }
          placeholder="e.g. infra, backend, db"
        />
        <span className="text-muted text-[11px] opacity-60">
          Comma-separated
        </span>
      </div>

      <button
        type="submit"
        className="bg-primary hover:bg-primary-light mt-1 cursor-pointer rounded border-none px-3 py-2 text-[13px] font-semibold text-white transition-colors duration-150"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function EditSection({
  selectedNode,
  onUpdateNode,
}: {
  selectedNode: AppNode;
  onUpdateNode: (id: string, patch: Partial<NodeData>) => void;
}) {
  const editFormId = useId();
  const [editForm, setEditForm] = useState({
    label: selectedNode.data.label,
    kind: selectedNode.data.kind,
    description: selectedNode.data.description ?? '',
    url: selectedNode.data.url ?? '',
    tags: selectedNode.data.tags?.join(', ') ?? '',
  });

  function handleUpdate(event: React.FormEvent) {
    event.preventDefault();

    if (!editForm.label.trim()) {
      return;
    }

    const tags = editForm.tags
      .split(',')
      .map((t) => t.trim())
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
      <div>
        <h2 className="text-muted m-0 text-[11px] font-semibold tracking-widest uppercase">
          Edit node
        </h2>
        <p className="text-muted mt-1 mb-0 truncate text-[11px]">
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
    </>
  );
}

export default function Sidebar({
  onAddNode,
  selectedNode,
  onUpdateNode,
}: Props) {
  const [addForm, setAddForm] = useState(defaultForm);
  const { screenToFlowPosition } = useReactFlow();
  const addFormId = useId();

  function handleAdd(event: React.FormEvent) {
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
      .map((t) => t.trim())
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
      } satisfies NodeData,
    });
    setAddForm(defaultForm);
  }

  return (
    <aside className="bg-surface border-border flex w-60 shrink-0 flex-col gap-5 overflow-y-auto border-r p-5">
      {selectedNode ? (
        <>
          <EditSection
            key={selectedNode.id}
            selectedNode={selectedNode}
            onUpdateNode={onUpdateNode}
          />
          <div className="border-border border-t pt-4">
            <h2 className="text-muted m-0 text-[11px] font-semibold tracking-widest uppercase">
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
          <h2 className="text-muted m-0 text-[11px] font-semibold tracking-widest uppercase">
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
