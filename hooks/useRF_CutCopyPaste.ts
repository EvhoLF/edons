import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Node,
  useKeyPress,
  useReactFlow,
  getConnectedEdges,
  Edge,
  XYPosition,
  useStore,
  type KeyCode,
} from '@xyflow/react';

export function useRF_CutCopyPaste<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
>() {
  const mousePosRef = useRef<XYPosition>({ x: 0, y: 0 });
  const rfDomNode = useStore((state) => state.domNode);

  const { getNodes, setNodes, getEdges, setEdges, screenToFlowPosition } =
    useReactFlow<NodeType, EdgeType>();

  const [bufferedNodes, setBufferedNodes] = useState([] as NodeType[]);
  const [bufferedEdges, setBufferedEdges] = useState([] as EdgeType[]);

  useEffect(() => {
    const events = ['cut', 'copy', 'paste'];

    if (rfDomNode) {
      const preventDefault = (e: Event) => e.preventDefault();
      const onMouseMove = (event: MouseEvent) => { mousePosRef.current = { x: event.clientX, y: event.clientY, }; };

      for (const event of events) { rfDomNode.addEventListener(event, preventDefault); }
      rfDomNode.addEventListener('mousemove', onMouseMove);

      return () => {
        for (const event of events) { rfDomNode.removeEventListener(event, preventDefault); }
        rfDomNode.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [rfDomNode]);

  const copy = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getConnectedEdges(selectedNodes, getEdges()).filter(
      (edge) => {
        const isExternalSource = selectedNodes.every((n) => n.id !== edge.source);
        const isExternalTarget = selectedNodes.every((n) => n.id !== edge.target);
        return !(isExternalSource || isExternalTarget);
      }
    );
    setBufferedNodes(selectedNodes);
    setBufferedEdges(selectedEdges);
  }, [getNodes, getEdges]);

  const cut = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getConnectedEdges(selectedNodes, getEdges()).filter(
      (edge) => {
        const isExternalSource = selectedNodes.every((n) => n.id !== edge.source);
        const isExternalTarget = selectedNodes.every((n) => n.id !== edge.target);
        return !(isExternalSource || isExternalTarget);
      }
    );
    setBufferedNodes(selectedNodes);
    setBufferedEdges(selectedEdges);
    setNodes((nodes) => nodes.filter((node) => !node.selected));
    setEdges((edges) => edges.filter((edge) => !selectedEdges.includes(edge)));
  }, [getNodes, setNodes, getEdges, setEdges]);

  const paste = useCallback(
    (
      { x: pasteX, y: pasteY } = screenToFlowPosition({ x: mousePosRef.current.x, y: mousePosRef.current.y, })
    ) => {
      const minX = Math.min(...bufferedNodes.map((s) => s.position.x));
      const minY = Math.min(...bufferedNodes.map((s) => s.position.y));
      const now = Date.now();

      const newNodes: NodeType[] = bufferedNodes.map((node) => {
        const id = `${node.id}-${now}`;
        const x = pasteX + (node.position.x - minX);
        const y = pasteY + (node.position.y - minY);
        return { ...node, id, position: { x, y } };
      });

      const newEdges: EdgeType[] = bufferedEdges.map((edge) => {
        const id = `${edge.id}-${now}`;
        const source = `${edge.source}-${now}`;
        const target = `${edge.target}-${now}`;
        return { ...edge, id, source, target };
      });
      setNodes((nodes) => [...nodes.map((node) => ({ ...node, selected: false })), ...newNodes,]);
      setEdges((edges) => [...edges.map((edge) => ({ ...edge, selected: false })), ...newEdges,]);
    },
    [bufferedNodes, bufferedEdges, screenToFlowPosition, setNodes, setEdges]
  );
  useShortcut(['Meta+x', 'Control+x'], cut);
  useShortcut(['Meta+c', 'Control+c'], copy);
  useShortcut(['Meta+v', 'Control+v'], paste);
  return { cut, copy, paste, bufferedNodes, bufferedEdges };
}

function useShortcut(keyCode: KeyCode, callback: () => void): void {
  const [didRun, setDidRun] = useState(false);
  const shouldRun = useKeyPress(keyCode);
  useEffect(() => {
    if (shouldRun && !didRun) { callback(); setDidRun(true); }
    else { setDidRun(shouldRun); }
  }, [shouldRun, didRun, callback]);
}

export default useRF_CutCopyPaste;
