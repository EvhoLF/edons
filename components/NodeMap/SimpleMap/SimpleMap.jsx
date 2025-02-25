"use client";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { ReactFlow, addEdge, Background, Controls, MiniMap, Panel, useEdgesState, useNodesState, ConnectionMode } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { initialEdges, initialNodes } from "@/data/_temp/nodes";
import styles from './SimpleMap.module.scss'
import { getLayout } from "@/utils/getLayout";
import { ParseFileInNode } from "@/utils/Nodes/ParseFileInNode";
import useGithub from "@/hooks/useGithub";
import Button from "@/components/UI/Button/Button";
import { ParseGitInNode } from "@/utils/Nodes/ParseGitInNode";
import { UserPanel } from "@/components/Auth/UserPanel/UserPanel";
import { Icon } from "@/components/UI/Icon/Icon";
import PanelTools from "../PanelTools/PanelTools";
import { nodeTypes } from "../Nodes";
import { edgeTypes } from "../Edge";
import { useDnD } from "@/hooks/DnDProvider";
import { GetNewNode } from "@/utils/Nodes/NodeManagement";
import PanelNodeManager from "../PanelControlNode/PanelNodeManager";
import useRF from "@/hooks/useRF";
import MiniMapNode from "../MiniMapNodes/MiniMapNodes";
import useHelperLines from "@/hooks/useHelperLines";
import HelperLines from "../HelperLines/HelperLines";
import useRF_CutCopyPaste from "@/hooks/useRF_CutCopyPaste";
import useRF_UndoRedo from "@/hooks/useRF_UndoRedo";

export const NodesContext = createContext('');

const SimpleMap = () => {
  const { fitView, zoomIn, zoomOut, fitBounds, screenToFlowPosition, getNodeDataField } = useRF();
  const { session, auth, repos, fetchGitHub } = useGithub();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isInteractivity, setIsInteractivity] = useState(true);
  // const [directionMap, setDirectionMap] = useState(false);
  // const [selectNode, setSelectNode] = useState(nodes[0]?.id || null);
  const [orientation, setOrientation] = useState('TB');
  useRF_CutCopyPaste();

  // const dispatchSelectNode = (e, { id }) => {
  //   setSelectNode(id);
  // }

  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayout(nodes, edges, direction);
      setNodes(() => [...layouted.nodes]);
      setEdges(() => [...layouted.edges]);
      window.requestAnimationFrame(() => {
        fitView();
      });
      setOrientation(direction);
    },
    [nodes, edges, fitView],
  );



  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onLayout(orientation); }, [nodes[0]?.measured]);

  const [helperLineHorizontal, helperLineVertical, helperLinesNodeChange] = useHelperLines();

  const handlerNodesChange = (e) => {
    helperLinesNodeChange(e);
  }

  const a_onNodesChange = useCallback(
    (changes) => { setNodes((nodes) => helperLinesNodeChange(changes, nodes)); },
    [setNodes, helperLinesNodeChange]
  );


  return (
    <div className={styles.Map}>
      <NodesContext.Provider value={{ setNodes, isInteractivity, orientation }}>
        <ReactFlow
          colorMode="dark"
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={a_onNodesChange}
          onEdgesChange={onEdgesChange}
          connectionMode={ConnectionMode.Loose}
          connectionLineStyle={{ stroke: '#999' }}
          onConnect={onConnect}
          proOptions={{ hideAttribution: true }}
          // itemProp={'zxc'}
          fitView
          minZoom={0.1}
          // onMoveStart={}
          nodesDraggable={isInteractivity}
          nodesConnectable={isInteractivity}
          elementsSelectable={isInteractivity}
          snapGrid={[10, 10]}
          snapToGrid={true}
        // onPaneMouseEnter={(e) => {
        //   console.log(e);
        // }}
        >
          <Panel position="top-left" className={styles.Panel_PanelTools}>
          </Panel>
          {/* <Backgroun/> */}
        </ReactFlow>
      </NodesContext.Provider>
    </div >
  );
};


export default SimpleMap;