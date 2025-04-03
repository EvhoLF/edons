'use client'
import React, { useMemo } from 'react';
import CodePad from '../../CodePad/CodePad';

const PanelCode = ({ selectedNode, codeData }) => {
  if (!selectedNode || selectedNode.type !== 'code') return null;

  const { id, data } = selectedNode;

  const val = useMemo(() => {
    const nod = codeData?.find(e => e.id === id);
    return nod ? nod.data : 'html';
  }, [id, codeData]);

  return (
    <>
      <CodePad value={val} type={data.codeType} />
    </>
  );
};

export default React.memo(PanelCode);
