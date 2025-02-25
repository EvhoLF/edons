import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getStraightPath, StepEdge, type EdgeProps, } from '@xyflow/react';

export default function EdgeStep({ data, style, ...props }: EdgeProps) {
  const [edgePath] = StepEdge(props);

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