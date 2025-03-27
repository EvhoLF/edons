'use client'
import React, { useMemo } from 'react';
import PNMCode from './Panels/PNMCode';
import PNMShape from './Panels/PNMShape';

const PanelNodeManager = ({ selectedNode }) => {
  if (!selectedNode) return null;

  const { type } = selectedNode;

  const Panel = useMemo(() => {
    return {
      code: PNMCode,
      shape: PNMShape,
    }[type] ?? null;
  }, [type]);

  if (!Panel) return null;

  return <Panel node={selectedNode} />;
};

export default React.memo(PanelNodeManager, (prevProps, nextProps) => {
  // Сравниваем только необходимые части selectedNode, исключая position
  const prevNode = prevProps.selectedNode;
  const nextNode = nextProps.selectedNode;

  if (!prevNode || !nextNode) return prevNode === nextNode;

  return (
    prevNode.id === nextNode.id &&
    prevNode.type === nextNode.type &&
    prevNode.data === nextNode.data &&
    prevNode.targetPosition === nextNode.targetPosition &&
    prevNode.sourcePosition === nextNode.sourcePosition &&
    prevNode.measured === nextNode.measured &&
    prevNode.selected === nextNode.selected &&
    prevNode.dragging === nextNode.dragging
  );
});