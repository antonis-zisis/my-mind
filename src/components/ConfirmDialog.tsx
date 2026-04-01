interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-surface border-border w-72 rounded-lg border p-5 shadow-xl">
        <p className="text-text m-0 text-sm">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="border-border text-muted hover:text-text cursor-pointer rounded border bg-transparent px-3 py-1.5 text-xs transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded border border-red-500/60 bg-red-500/20 px-3 py-1.5 text-xs text-red-400 transition-colors duration-150 hover:bg-red-500/30"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
