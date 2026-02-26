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
  const hasContent = !!(data.description || data.url);

  return (
    <div
      className={`px-4 py-3 rounded-[10px] border-2 w-[200px] text-sm bg-project border-project-border text-project-text transition-shadow ${
        selected ? 'shadow-[0_0_0_3px_rgba(99,102,241,0.4)]' : ''
      }`}
      style={data.color ? { borderColor: data.color } : undefined}
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

      <div className="font-semibold text-sm leading-tight truncate text-center mb-1">
        {data.label}
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-widest opacity-60 text-center">
        project
      </div>

      {!compact && hasContent && (
        <>
          <div className="border-t border-project-border opacity-30 mt-2" />
          {data.description && (
            <div className="text-[11px] opacity-70 mt-2 leading-snug line-clamp-2">
              {data.description}
            </div>
          )}
          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[10px] opacity-50 mt-1 truncate no-underline text-inherit hover:opacity-90 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {data.url}
            </a>
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
