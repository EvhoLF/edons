import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getStraightPath, type EdgeProps, } from '@xyflow/react';

export default function EdgeStraight({ data, style, ...props }: EdgeProps) {
  const [edgePath] = getStraightPath(props);

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