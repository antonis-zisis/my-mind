import type { SubmitEvent } from 'react';
import type { NodeKind } from '../../types';

export const defaultForm = {
  label: '',
  kind: 'service' as NodeKind,
  description: '',
  url: '',
  tags: '',
};

export const inputClass =
  'w-full px-2.5 py-1.5 text-[13px] bg-surface-2 border border-border text-text rounded focus:outline-none focus:border-primary';

interface Props {
  formId: string;
  form: typeof defaultForm;
  setForm: React.Dispatch<React.SetStateAction<typeof defaultForm>>;
  onSubmit: (event: SubmitEvent) => void;
  submitLabel: string;
}

export default function NodeForm({
  formId,
  form,
  setForm,
  onSubmit,
  submitLabel,
}: Props) {
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
            setForm((form) => ({ ...form, label: event.target.value }))
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
            setForm((form) => ({
              ...form,
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
            setForm((form) => ({ ...form, description: event.target.value }))
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
            setForm((form) => ({ ...form, url: event.target.value }))
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
            setForm((form) => ({ ...form, tags: event.target.value }))
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
