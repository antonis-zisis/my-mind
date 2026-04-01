import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { NodeData } from '../../types';
import { useCompact } from '../../contexts/CompactContext';

type ProjectNodeType = Node<NodeData, 'project'>;

const handleClass = '!w-2.5 !h-2.5 !bg-[#475569] !border-2 !border-[#1e293b]';

export default function ProjectNode({
  data,
  selected,
}: NodeProps<ProjectNodeType>) {
  const compact = useCompact();
  const hasContent = !!(data.description || data.url || data.tags?.length);

  return (
    <div
      className={`bg-project text-project-text w-50 rounded-[10px] border-2 px-4 py-3 text-sm transition-shadow ${
        selected
          ? 'border-white shadow-[0_0_0_3px_rgba(255,255,255,0.15)]'
          : 'border-project-border'
      }`}
      style={!selected && data.color ? { borderColor: data.color } : undefined}
    >
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        className={handleClass}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        className={handleClass}
      />

      <div className="mb-1 truncate text-center text-sm leading-tight font-semibold">
        {data.label}
      </div>
      <div className="text-center text-[10px] font-semibold tracking-widest uppercase opacity-60">
        project
      </div>

      {!compact && hasContent && (
        <>
          <div className="border-project-border mt-2 border-t opacity-30" />
          {data.description && (
            <div className="mt-2 line-clamp-2 text-[11px] leading-snug opacity-70">
              {data.description}
            </div>
          )}
          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block truncate text-[10px] text-inherit no-underline opacity-50 hover:underline hover:opacity-90"
              onClick={(event) => event.stopPropagation()}
            >
              {data.url}
            </a>
          )}
          {data.tags && data.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] leading-none opacity-70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className={handleClass}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className={handleClass}
      />
    </div>
  );
}
