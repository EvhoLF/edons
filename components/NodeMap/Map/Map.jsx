//map.tsx
"use client";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  ConnectionMode,
  useKeyPress,
  useStore,
  useOnSelectionChange,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import throttle from "lodash.throttle";
import styles from "./Map.module.scss";
import { getLayout } from "@/utils/getLayout";
import { ParseFileInNode } from "@/utils/Nodes/ParseFileInNode";
import { ParseGitInNode } from "@/utils/Nodes/ParseGitInNode";
import UserPanel from "@/components/Auth/UserPanel/UserPanel";
import PanelTools from "../PanelTools/PanelTools";
import PanelMenu from "../PanelMenu/PanelMenu";
import { nodeTypes as rawNodeTypes } from "../Nodes";
import { edgeTypes as rawEdgeTypes } from "../Edge";
import { useDnD } from "@/hooks/DnDProvider";
import { GetNewNode } from "@/utils/Nodes/NodeManagement";
import PanelNodeManager from "../PanelControlNode/PanelNodeManager";
import PanelCode from "../PanelCode/PanelCode";
import useRF from "@/hooks/useRF";
import MiniMapNode from "../MiniMapNodes/MiniMapNodes";
import useHelperLines from "@/hooks/useHelperLines";
import useRF_CutCopyPaste from "@/hooks/useRF_CutCopyPaste";
import { IconButton, Stack } from "@mui/material";
import { Icon } from "@/components/UI/Icon/Icon";
import { useSession } from "next-auth/react";
import Frame from "@/components/UI/Frame/Frame";
import { MapAction } from "@/DB/actions/MapAction";
import domtoimage from "dom-to-image";
import { enqueueSnackbar } from "notistack";
import useGithub from "@/hooks/useGithub";
import Loader from "@/components/UI/Loader/Loader";
import { useModal } from "@/hooks/useModal";
import ModalConfirm from "@/components/Modals/ModalConfirm";
import Cursors from "@/hooks/coop/Cursors";
import { useSyncedFlow } from "@/hooks/coop/useSyncedFlow";
import { CodeDataAction } from "@/DB/actions/CodeDataAction";
import HelperLines from "../HelperLines/HelperLines";

export const NodesContext = createContext({});

const Map = ({ mapId, codeDataId, mapLabel, isPublicAccess = false }) => {
  // ==========================================================
  // Hooks & state
  // ==========================================================
  const { data: session } = useSession();
  const {
    fitView,
    zoomIn,
    zoomOut,
    screenToFlowPosition,
    getNodeDataField,
  } = useRF();
  const isShiftPressed = useKeyPress("Shift");
  const [isInteractivity, setIsInteractivity] = useState(true);
  const [loading, setLoading] = useState("");
  const [dnd] = useDnD();
  const { repos, GitFetchs } = useGithub();
  const { showModal, closeModal } = useModal();
  useRF_CutCopyPaste();

  // node/edge types – кешируем
  const nodeTypes = useMemo(() => rawNodeTypes, []);
  const edgeTypes = useMemo(() => rawEdgeTypes, []);

  // ==========================================================
  // Synced Flow (React Flow state + socket sync)
  // ==========================================================
  const {
    nodes,
    setNodes,
    onNodesChange: syncedNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    hasRoom,
    orientation,
    setOrientation,
    users,
    setUsers,
    codeData,
    setCodeData,
  } = useSyncedFlow({
    session,
    isPublicAccess,
    room: `${mapId}-nodes-edges`,
    serverUrl: process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3005",
  });


  // ==========================================================
  // Throttled helpers
  // ==========================================================
  const throttledNodesChange = useRef(
    throttle((changes) => syncedNodesChange(changes), 60)
  ).current;

  // ==========================================================
  // Callbacks (стабильные)
  // ==========================================================
  const onMouseMove = useCallback(
    (e) => {
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      setUsers(session?.user, { pos: [pos.x, pos.y] });
    },
    [screenToFlowPosition, setUsers, session?.user]
  );

  const onLayout = useCallback(
    (dir) => {
      const layouted = getLayout(nodes, edges, dir);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      requestAnimationFrame(fitView);
      setOrientation(dir);
    },
    [nodes, edges, fitView, setNodes, setEdges, setOrientation]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (!dnd || dnd.type !== "ADD_NODE") return;
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const newNode = GetNewNode({
        type: dnd.data.nodeType,
        subType: dnd.data?.subType,
        data_main: { position: pos },
      });
      console.log({ newNode });

      setNodes((ns) => [...ns, newNode]);
      setCodeData((ns) => [...ns, { id: newNode.id, data: '' }]);
    },
    [dnd, screenToFlowPosition, setNodes]
  );

  // Helper‑lines
  const [hlH, hlV, helperLinesNodeChange] = useHelperLines();

  const onNodesChange = useCallback(
    (changes) => {
      // 1) применяем ВСЕ изменения – selected/position обновляются мгновенно
      setNodes((ns) => applyNodeChanges(changes, ns));
      // 2) по сети шлём ТОЛЬКО важные изменения (без select) и с throttling
      const toEmit = changes.filter((c) => c.type !== "select");
      if (toEmit.length) throttledNodesChange(toEmit);
      // 3) helper‑линии активны при зажатом Shift
      if (isShiftPressed) {
        setNodes((ns) => helperLinesNodeChange(changes, ns));
      } else {
        helperLinesNodeChange([], []);
      }
    },
    [isShiftPressed, throttledNodesChange, helperLinesNodeChange, setNodes]
  );

  // ==========================================================
  // Файлы → узлы / GitHub import
  // ==========================================================
  const NodeAddFromFiles = useCallback(async (files) => {
    const { newNodes, newEdges } = await ParseFileInNode(files);
    setNodes((ns) => [...ns, ...newNodes]);
    setEdges((es) => [...es, ...newEdges]);
  }, []);

  const LoadFromGitMap = useCallback(
    (repo) => {
      showModal({
        content: (
          <ModalConfirm
            title="Загрузка репозитория"
            text="Вы уверены, что хотите загрузить репозиторий?"
            onConfirm={async () => {
              closeModal();
              setLoading("Импорт из GitHub…");
              try {
                const tree = await GitFetchs.RepoTreeContent(
                  repo.full_name,
                  repo.default_branch
                );
                const { newNodes, newEdges, newCodeData } = await ParseGitInNode(tree);
                const layouted = getLayout(newNodes, newEdges, "LR");
                setCodeData(newCodeData);
                setNodes(layouted.nodes);
                setEdges(layouted.edges);
                requestAnimationFrame(fitView);
                setOrientation("LR");
              } finally {
                setLoading("");
              }
            }}
            closeModal={closeModal}
          />
        ),
      });
    },
    [GitFetchs, closeModal, fitView, setEdges, setNodes, setOrientation, showModal]
  );

  // ==========================================================
  // Скриншот + сохранение карты
  // ==========================================================
  const takeScreenshot = useCallback(async () => {
    const canvasEl = document.querySelector(".react-flow__renderer");
    if (!canvasEl) return;
    await fitView();
    await new Promise((r) => setTimeout(r, 400));
    const imgData = await domtoimage.toPng(canvasEl, { bgcolor: "transparent" });
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "screenshot.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [fitView]);

  const compressImage = async (el) => {
    const src = await domtoimage.toPng(el, { bgcolor: "transparent" });
    const img = new Image();
    img.src = src;
    await new Promise((res) => (img.onload = res));
    const canvas = document.createElement("canvas");
    canvas.width = img.width / 3;
    canvas.height = img.height / 3;
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  };

  const saveScreenshot = useCallback(async () => {
    const el = document.querySelector(".react-flow__renderer");
    if (!el) return;
    await fitView();
    await new Promise((r) => setTimeout(r, 400));
    const img = await compressImage(el);
    return MapAction.updateImage(mapId, img);
  }, [mapId, fitView]);

  const saveMap = useCallback(async () => {
    if (!mapId) return;
    try {
      await MapAction.update(mapId, {
        nodes,
        edges,
        orientation,
        lastUpdate: Date.now(),
      });
      await CodeDataAction.update(codeDataId, { nodes: codeData });
      await saveScreenshot();
      enqueueSnackbar("Карта успешно сохранена", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("Ошибка сохранения карты", { variant: "error" });
    }
  }, [mapId, nodes, edges, orientation, codeData, codeDataId, saveScreenshot]);

  // ==========================================================
  // Initial load from DB (если нет Socket room)
  // ==========================================================
  useEffect(() => {
    const load = async () => {
      if (mapId && codeDataId && !(hasRoom && isPublicAccess)) {
        try {
          setLoading("Загрузка карты…");
          const [mapRes, codeRes] = await Promise.all([
            MapAction.getById(mapId),
            CodeDataAction.getById(codeDataId),
          ]);
          if (codeRes?.nodes) setCodeData(codeRes.nodes);
          if (mapRes?.nodes) setNodes(mapRes.nodes);
          if (mapRes?.edges) setEdges(mapRes.edges);
          if (mapRes?.orientation) setOrientation(mapRes.orientation);
          fitView();
        } finally {
          setLoading("");
        }
      }
    };
    load();
  }, [mapId, codeDataId, hasRoom, setNodes, setEdges, setOrientation, fitView]);

  // ==========================================================
  // selectedNode (восстановили логику)
  // ==========================================================
  const [selectedNode, setSelectedNode] = useState(null);
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNode(nodes.length ? nodes[0] : null);
    },
  });
  const onSelectionChange = useCallback(({ nodes }) => {
    setSelectedNode(nodes.length ? nodes[0] : null);
  }, [setSelectedNode]);


  // ==========================================================
  // JSX
  // ==========================================================
  return (
    <div className={styles.Map}>
      <Loader loading={loading} />
      <NodesContext.Provider
        value={useMemo(
          () => ({ setNodes, isInteractivity, orientation }),
          [setNodes, isInteractivity, orientation]
        )}
      >
        <div style={{ width: "100%", height: "100%" }}>
          <ReactFlow
            onSelectionChange={onSelectionChange}
            // onSelectionEnd={e => console.log(e)}
            onMouseMove={onMouseMove}
            onNodeDrag={onMouseMove}
            onDrop={onDrop}
            onDragOver={onDragOver}
            colorMode="dark"
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            connectionMode={ConnectionMode.Loose}
            connectionLineStyle={useMemo(() => ({ stroke: "#999" }), [])}
            onConnect={onConnect}
            proOptions={{ hideAttribution: true }}
            fitView
            minZoom={0.1}
            nodesDraggable={isInteractivity}
            nodesConnectable={isInteractivity}
            elementsSelectable={isInteractivity}
            snapGrid={[10, 10]}
            snapToGrid={true}
            onlyRenderVisibleElements
          >
            <Cursors syncUsers={users} thisUserId={session?.user?.id} />
            <Panel position="top-left" className={styles.Panel_PanelTools}>
              {/* <div>
              <Button onClick={async () => {
                await NodeAddFromGit();
              }}> GIT ADD </Button>
            </div> */}
              <Stack direction='row' height='100%' spacing={2}>
                <PanelCode selectedNode={selectedNode} codeData={codeData} setCodeData={setCodeData} />
                <Stack spacing={2}>
                  <PanelMenu isPublicAccess={isPublicAccess} saveMap={saveMap} TakeScreenshot={takeScreenshot} LoadFromGitMap={LoadFromGitMap} githubAccess={session?.github_access_token} repos={repos} />
                  <Frame sx={{ width: 'fit-content' }} p={.5}>
                    <IconButton onClick={saveMap} color='primary'><Icon icon='save' color='ui' /></IconButton>
                  </Frame>
                  <PanelTools />
                </Stack>
              </Stack>
            </Panel>
            <Panel position="top-right" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Stack alignItems='end'>
                <Frame width='fit-content' p={.5}>
                  <UserPanel />
                </Frame>
              </Stack>
              <PanelNodeManager selectedNode={selectedNode} />
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
            <HelperLines horizontal={hlH} vertical={hlV} />
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
      </NodesContext.Provider >
    </div >
  );
};


export default Map;