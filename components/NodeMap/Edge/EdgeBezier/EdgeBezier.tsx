import React, { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

function CustomEdge({ id, data, ...props }: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath(props);

  return (
    <>
      <BaseEdge path={edgePath} markerStart={''} markerEnd={''} style={style} />
      <EdgeLabelRenderer>
        <div>
          {data?.label as string ?? ''}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(CustomEdge)