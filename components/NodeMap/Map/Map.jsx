"use client";
import React, { createContext, use, useCallback, useEffect, useRef, useState } from "react";
import { ReactFlow, addEdge, Background, Controls, MiniMap, Panel, useEdgesState, useNodesState, ConnectionMode, useKeyPress } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import styles from './Map.module.scss'
import { getLayout } from "@/utils/getLayout";
import { ParseFileInNode } from "@/utils/Nodes/ParseFileInNode";
import { ParseGitInNode } from "@/utils/Nodes/ParseGitInNode";
import UserPanel from "@/components/Auth/UserPanel/UserPanel";
import PanelTools from "../PanelTools/PanelTools";
import PanelMenu from '../PanelMenu/PanelMenu'
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
import { IconButton, Stack } from "@mui/material";
import { Icon } from "@/components/UI/Icon/Icon";
import { useSession } from "next-auth/react";
import Frame from "@/components/UI/Frame/Frame";
import { MapAction } from "@/DB/actions/MapAction";
import domtoimage from "dom-to-image";
import { enqueueSnackbar } from "notistack";
import useGithub from '@/hooks/useGithub'
import Loader from "@/components/UI/Loader/Loader";
import { useModal } from "@/hooks/useModal";
import ModalConfirm from "@/components/Modals/ModalConfirm";
import { useSyncedState } from "@/hooks/coop/useSyncedState";
import Cursors from "@/hooks/coop/Cursors";
import { useSyncedFlow } from "@/hooks/coop/useSyncedFlow";

export const NodesContext = createContext('');

const Map = ({ mapId, mapLabel, isPublicAccess = false }) => {
  const { data: session } = useSession();
  const { fitView, zoomIn, zoomOut, fitBounds, screenToFlowPosition, getNodeDataField, getNodeSelected } = useRF();
  const [isInteractivity, setIsInteractivity] = useState(true);
  useRF_CutCopyPaste();
  const isCtrlPressed = useKeyPress('Shift');

  const [loading, setLoading] = useState('');
  const { showModal, closeModal } = useModal();
  const { repos, GitFetchs } = useGithub();

  // const [nodes, setNodes, onNodesChange] = useNodesState();
  // const [edges, setEdges, onEdgesChange] = useEdgesState();
  // const [syncNodes, setSyncNodes] = useSyncedState({ initialState: [], roomName: `${mapId}-nodes`, serverUrl: 'http://localhost:3005' });
  // const [syncEdges, setSyncEdges] = useSyncedState({ initialState: [], roomName: `${mapId}-edges`, serverUrl: 'http://localhost:3005' });

  const {
    nodes, setNodes, onNodesChange,
    edges, setEdges, onEdgesChange,
    hasRoom, orientation, setOrientation,
    users, setUsers
  } = useSyncedFlow({
    thisUser: session?.user,
    isPublicAccess,
    room: `${mapId}-nodes-edges`,
    serverUrl: 'http://localhost:3005',
  });


  const onMouseMove = useCallback((event) => {
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setUsers(session?.user, { position: [position.x, position.y] });
  }, [session?.user]);

  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayout(nodes, edges, direction);
      setNodes(() => [...layouted.nodes]);
      setEdges(() => [...layouted.edges]);
      window.requestAnimationFrame(() => { fitView(); });
      setOrientation(direction);
    },
    [nodes, edges, fitView],
  );

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const NodeAddFromFiles = async (e) => {
    const { newNodes, newEdges } = await ParseFileInNode(e); //
    setNodes(prev => [...prev, ...newNodes]);
    setEdges(prev => [...prev, ...newEdges]);
  }

  const LoadFromGitMap = async (repo) => {

    showModal({
      content: <ModalConfirm title='Загрузка репозитория' text='Вы уверены, что хотите загрузить репозиторий?'
        onConfirm={async () => {
          closeModal();
          setLoading('Файлы загружаются из репозитория, процесс может занять некоторое время');
          try {
            const repoTreeContent = await GitFetchs.RepoTreeContent(repo.full_name, repo.default_branch);
            const { newNodes, newEdges } = await ParseGitInNode(repoTreeContent);
            // setNodes([...newNodes]);
            // setEdges([...newEdges]);
            const layouted = getLayout([...newNodes], [...newEdges], 'LR');
            setNodes(() => [...layouted.nodes]);
            setEdges(() => [...layouted.edges]);
            window.requestAnimationFrame(() => { fitView(); });
            setOrientation('LR');
          }
          finally {
            setLoading(false);
          }
        }}
        closeModal={closeModal} />
    })
  }

  const [dnd] = useDnD();
  const onDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    if (!dnd || dnd?.type != 'ADD_NODE') { return; }
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY, });
    const newNode = GetNewNode({ type: dnd.data.nodeType, subType: dnd?.data?.subType, data_main: { position } });
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, screenToFlowPosition, dnd]);

  const [helperLineHorizontal, helperLineVertical, helperLinesNodeChange] = useHelperLines();

  const a_onNodesChange = useCallback(
    (changes) => {
      if (isCtrlPressed) setNodes((nodes) => helperLinesNodeChange(changes, nodes));
      else { onNodesChange(changes); helperLinesNodeChange([], []) }
    },
    [setNodes, helperLinesNodeChange, isCtrlPressed]
  );


  useEffect(() => {
    const get = async () => {
      try {
        if (mapId && !hasRoom) {
          console.log('ЗАГРУЗКА С БД');
          const res = await MapAction.getById(mapId);
          if (res.error) return;
          if (res.nodes) setNodes(res.nodes)
          if (res.edges) setEdges(res.edges)
          fitView();
        }
      }
      catch {
        console.log('Ошибка загрузки карты');
      }
    }
    get();
  }, [mapId]);


  const TakeScreenshot = async () => {
    try {
      const element = document.querySelector('.react-flow__renderer');
      if (!element) return console.error(`Элемент с id .react-flow__renderer не найден`);
      await fitView();
      await new Promise((resolve) => setTimeout(resolve, 500));
      const imgData = await domtoimage.toPng(element, { bgcolor: "transparent" });
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "screenshot.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    catch { }
  };

  const saveScreenshot = async () => {
    try {
      const element = document.querySelector('.react-flow__renderer');
      if (!element) return console.error(`Элемент с id .react-flow__renderer не найден`);
      await fitView();
      await new Promise((resolve) => setTimeout(resolve, 500));
      const imgData = await domtoimage.toPng(element, { bgcolor: "transparent" });
      return await MapAction.updateImage(mapId, imgData);
    }
    catch { }
  };

  const saveMap = async () => {
    try {
      if (!mapId) return;
      const res = await MapAction.update(mapId, { nodes, edges, lastUpdate: Date.now() });
      if (res) console.log({ save: 'save', res });
      await saveScreenshot();
      enqueueSnackbar('Карта успешно сохранена', { variant: 'success', });
    }
    catch (error) {
      enqueueSnackbar('Ошибка сохранения карты', { variant: 'error', });
      console.log('Ошибка сохранения карты');
    }
  }

  return (
    <div className={styles.Map}>
      <Loader loading={loading} />
      <NodesContext.Provider value={{ setNodes, isInteractivity, orientation }}>
        <div style={{ width: "100%", height: "100%" }}>
          <ReactFlow
            onMouseMove={onMouseMove}
            onNodeDrag={onMouseMove}
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
            fitView
            minZoom={0.1}
            nodesDraggable={isInteractivity}
            nodesConnectable={isInteractivity}
            elementsSelectable={isInteractivity}
            snapGrid={[10, 10]}
            snapToGrid={true}
          >
            <Cursors syncUsers={users} thisUserId={session?.user?.id} />
            <Panel position="top-left" className={styles.Panel_PanelTools}>
              {/* <div>
              <Button onClick={async () => {
                await NodeAddFromGit();
              }}> GIT ADD </Button>
            </div> */}
              <Stack spacing={2}>
                <PanelMenu saveMap={saveMap} TakeScreenshot={TakeScreenshot} LoadFromGitMap={LoadFromGitMap} githubAccess={session?.github_access_token} repos={repos} />
                <Frame sx={{ width: 'fit-content' }} p={.5}>
                  <IconButton onClick={saveMap} color='primary'><Icon icon='save' color='ui' /></IconButton>
                </Frame>
                <PanelTools />
              </Stack>
            </Panel>
            <Panel position="top-right" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Stack alignItems='end'>
                <Frame width='fit-content' p={.5}>
                  <UserPanel />
                </Frame>
              </Stack>
              <PanelNodeManager selectedNode={getNodeSelected()} />
            </Panel>

            <MiniMap
              className={styles.MiniMap}
              nodeStrokeWidth={14}
              nodeBorderRadius={0}
              nodeComponent={MiniMapNode}
              nodeColor={({ id }) => getNodeDataField(id, 'colorBG') ?? '#352a2b'}
              nodeStrokeColor={({ id }) => getNodeDataField(id, 'color') ?? '#ffccee'}
              bgColor="rgb(45, 25, 35, 0.3)"
              maskColor="rgb(26, 22, 24, .8)"
              maskStrokeColor="#ff0055"
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
              <Frame sx={{ p: 0 }}>
                <Stack direction='row' width={'100%'} justifyContent='space-between' sx={{ '& svg': { fontSize: '17px' } }}>
                  <IconButton color='primary' onClick={zoomIn}><Icon color='ui' icon='plus' /></IconButton>
                  <IconButton color='primary' onClick={zoomOut}><Icon color='ui' icon='minus' /></IconButton>
                  <IconButton color='primary' onClick={fitView}><Icon color='ui' icon='focus' /></IconButton>
                  <IconButton color='primary' onClick={() => onLayout("TB")}><Icon color='ui' icon='linesVertical' /></IconButton>
                  <IconButton color='primary' onClick={() => onLayout("LR")}><Icon color='ui' icon='linesHorizontal' /></IconButton>
                  <IconButton color='primary' onClick={() => { setIsInteractivity(e => !e) }}><Icon color='ui' icon={isInteractivity ? 'lockUnlock' : 'lock'} /></IconButton>
                </Stack>
              </Frame>
            </Controls>
            <Background color="#556" size={1} gap={30} />
          </ReactFlow>
        </div >
      </NodesContext.Provider>
    </div >
  );
};


export default Map;