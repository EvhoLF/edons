import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps, } from '@xyflow/react';

export default function EdgeSmoothstep({ data, style, ...props }: EdgeProps) {
  const [edgePath] = getSmoothStepPath(props);

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