'use client'
import React, { useCallback, useMemo } from 'react';
import CodePad from '../../CodePad/CodePad';
import useRF from '@/hooks/useRF';

const PanelCode = ({ selectedNode, codeData, setCodeData, setNodes }) => {
  if (!selectedNode || selectedNode.type !== 'code') return null;

  const { id, data } = selectedNode;

  const value = useMemo(() => {
    const entry = codeData.find((e) => e.id === id);
    return entry ? entry.data : '';
  }, [id, codeData]);

  /** колбэк изменения кода (обновляет и codeData, и сам узел) */
  const handleChange = useCallback(
    (newCode) => {
      // 1) обновляем codeData
      setCodeData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, data: newCode } : item
        )
      );
    },
    [id, setCodeData, setNodes]
  );

  return (
    <CodePad
      value={value}
      type={data.codeType ?? 'text'}
      onChange={handleChange}
    />
  );
};

export default React.memo(PanelCode);
