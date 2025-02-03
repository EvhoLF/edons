'use client'
import React from 'react';
import useRF from '@/hooks/useRF';
import PNMCode from './Panels/PNMCode';
import PNMShape from './Panels/PNMShape';

const PanelNodeManager = () => {
  const { getNodeSelected } = useRF();
  const selectedNode = getNodeSelected();

  if (!selectedNode) return '';
  const { type } = selectedNode;

  const Panel = {
    code: PNMCode,
    shape: PNMShape,
  }[type] ?? null

  if (!Panel) return ''

  return <Panel node={selectedNode} />
};

// export default memo(PanelControlNode, areEqual);
export default PanelNodeManager