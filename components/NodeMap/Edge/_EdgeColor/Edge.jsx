import React from 'react';
import { getBezierPath, getMarkerEnd, useNodes } from '@xyflow/react';

const Edge = (z) => {
  const {
    id,
    sourceX, sourceY,
    targetX, targetY,
    sourcePosition, targetPosition,
    style = {},
    data,
    selected
  } = z

  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });

  const sourceColor = data?.sourceColor || '#fff';
  const targetColor = data?.targetColor || '#fff';


  // Создаем градиентный ID
  const gradientId = `gradient-${id}`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
          <stop offset="0%" stopColor={sourceColor} />
          <stop offset="100%" stopColor={targetColor} />
        </linearGradient>
      </defs>
      <path
        id={id}
        style={{ ...style, stroke: `url(#${gradientId})`, strokeWidth: selected ? 3 : 1 }}
        className="react-flow__edge-path"
        d={edgePath}
      // markerEnd={getMarkerEnd(arrowHeadType, markerEndId)}
      />
    </>
  );
};

export default Edge;