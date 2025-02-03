import { useCallback, useEffect, useState } from 'react';
import { Edge, Node, useReactFlow } from '@xyflow/react';

type useRF_UndoRedoOptions = {
  maxHistorySize: number;
  enableShortcuts: boolean;
};

type useRF_UndoRedoType = (options?: useRF_UndoRedoOptions) => {
  undo: () => void;
  redo: () => void;
  takeSnapshot: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

type HistoryItem = {
  nodes: Node[];
  edges: Edge[];
};

const defaultOptions: useRF_UndoRedoOptions = {
  maxHistorySize: 100,
  enableShortcuts: true,
};

export const useRF_UndoRedo: useRF_UndoRedoType = ({
  maxHistorySize = defaultOptions.maxHistorySize,
  enableShortcuts = defaultOptions.enableShortcuts,
} = defaultOptions) => {
  const [past, setPast] = useState<HistoryItem[]>([]);
  const [future, setFuture] = useState<HistoryItem[]>([]);

  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();
  const takeSnapshot = useCallback(() => {
    setPast((past) => [
      ...past.slice(past.length - maxHistorySize + 1, past.length),
      { nodes: getNodes(), edges: getEdges() },
    ]);
    setFuture([]);
  }, [getNodes, getEdges, maxHistorySize]);

  const undo = useCallback(() => {
    const pastState = past[past.length - 1];
    if (pastState) {
      setPast((past) => past.slice(0, past.length - 1));
      setFuture((future) => [...future, { nodes: getNodes(), edges: getEdges() },]);
      setNodes(pastState.nodes);
      setEdges(pastState.edges);
    }
  }, [setNodes, setEdges, getNodes, getEdges, past]);

  const redo = useCallback(() => {
    const futureState = future[future.length - 1];
    if (futureState) {
      setFuture((future) => future.slice(0, future.length - 1));
      setPast((past) => [...past, { nodes: getNodes(), edges: getEdges() }]);
      setNodes(futureState.nodes);
      setEdges(futureState.edges);
    }
  }, [setNodes, setEdges, getNodes, getEdges, future]);

  useEffect(() => {
    if (!enableShortcuts) { return; }
    const keyDownHandler = ({ key, ctrlKey, metaKey, shiftKey }: KeyboardEvent) => {
      if (key === 'z' && (ctrlKey || metaKey) && shiftKey) { redo(); }
      else if (key === 'z' && (ctrlKey || metaKey)) { undo(); }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => { document.removeEventListener('keydown', keyDownHandler); };
  }, [undo, redo, enableShortcuts]);
  return { undo, redo, takeSnapshot, canUndo: !past.length, canRedo: !future.length, };
};

export default useRF_UndoRedo;