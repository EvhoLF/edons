"use client";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { ReactFlow, addEdge, Background, Controls, MiniMap, Panel, useEdgesState, useNodesState, ConnectionMode } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { initialEdges, initialNodes } from "@/data/_temp/nodes";
import styles from './Map.module.scss'
import { getLayout } from "@/utils/getLayout";
import { ParseFileInNode } from "@/utils/Nodes/ParseFileInNode";
import useGithub from "@/hooks/useGithub";
import Button from "@/components/UI/InputButton/InputButton";
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

const Map = () => {
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

  const NodeAddFromFiles = async (e) => {
    const { newNodes, newEdges } = await ParseFileInNode(e); //
    setNodes(prev => [...prev, ...newNodes]);
    setEdges(prev => [...prev, ...newEdges]);
  }

  const NodeAddFromGit = async () => {
    // bxgeokurs inputNumberMask trenim useScrollToAnchor
    const repoTreeContent = await fetchGitHub.RepoTreeContent(session.user.username, 'bxgeokurs');
    console.log(repoTreeContent);
    const { newNodes, newEdges } = await ParseGitInNode(repoTreeContent);

    setNodes(prev => [...prev, ...newNodes]);
    setEdges(prev => [...prev, ...newEdges]);
  }

  const [dnd] = useDnD();

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (!dnd && dnd.type == 'ADD_NODE') { return; }
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY, });
      const newNode = GetNewNode({ type: dnd.data.nodeType, subType: dnd?.data?.subType, data_main: { position } });

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, screenToFlowPosition, dnd],
  );

  const [helperLineHorizontal, helperLineVertical, helperLinesNodeChange] = useHelperLines();

  const handlerNodesChange = (e) => {
    helperLinesNodeChange(e);
  }

  const a_onNodesChange = useCallback(
    (changes) => { setNodes((nodes) => helperLinesNodeChange(changes, nodes)); },
    [setNodes, helperLinesNodeChange]
  );

  // console.log(nodes.map(e => ({ ...e, data: { ...e.data, codeData: '' } })));


  return (
    <div className={styles.Map}>
      <NodesContext.Provider value={{ setNodes, isInteractivity, orientation }}>
        <ReactFlow
          onDrop={onDrop}
          onDragOver={onDragOver}
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
            <div>
              <Button onClick={async () => {
                await NodeAddFromGit();
              }}> GIT ADD </Button>
            </div>
            <PanelTools />
            {/* <Menu menuPlacement="right-start">
              <MenuButton>Menu</MenuButton>
              <MenuDropList>
                <MenuListItem>Show playlist</MenuListItem>
                <MenuListItem>Share post</MenuListItem>
              </MenuDropList>
            </Menu> */}
            {/* <DropdownMenu/> */}
          </Panel>

          <Panel position="top-right" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <UserPanel />
            <PanelNodeManager />
          </Panel>

          <MiniMap
            className={styles.MiniMap}
            nodeStrokeWidth={14}
            nodeBorderRadius={0}
            nodeComponent={MiniMapNode}
            nodeColor={({ id }) => getNodeDataField(id, 'colorBG') ?? '#2a2b2f'}
            nodeStrokeColor={({ id }) => getNodeDataField(id, 'color') ?? '#eeeeff'}
            bgColor="rgb(42, 42, 70, 0.3)"
            maskColor="rgb(22, 22, 30, 0.7)"
            maskStrokeColor="#7777ff"
            offsetScale={5}
            zoomable
            zoomStep={2}
            pannable
          />
          <HelperLines horizontal={helperLineHorizontal} vertical={helperLineVertical} />
          <Controls
            className={styles.xyflowControls}
            position="bottom-right"
            showFitView={false} showZoom={false} showInteractive={false}
          >
            <Button onClick={() => { zoomIn() }} iconLeft="plus" variant='colorGlass' dimension="xs" square />
            <Button onClick={() => { zoomOut() }} iconLeft="minus" variant='colorGlass' dimension="xs" square />
            <Button onClick={() => { fitView() }} iconLeft="focus" variant='colorGlass' dimension="xs" square />
            <Button onClick={() => onLayout("TB")} iconLeft="linesVertical" variant='colorGlass' dimension="xs" square />
            <Button onClick={() => onLayout("LR")} iconLeft="linesHorizontal" variant='colorGlass' dimension="xs" square />
            <Button onClick={() => { setIsInteractivity(e => !e) }} iconLeft={isInteractivity ? 'lockUnlock' : 'lock'} variant='colorGlass' dimension="xs" square />
          </Controls>
          <Background color="#556" size={1} gap={30} />
        </ReactFlow>
      </NodesContext.Provider>
    </div >
  );
};


export default Map;