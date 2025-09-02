import Dagre from '@dagrejs/dagre';

const NODE_WIDTH = 400;
const NODE_HEIGHT = 60;
const HORIZONTAL_OFFSET = 100;
const VERTICAL_OFFSET = 100;
const GRID_COLUMNS = 3;

const calculateNodePosition = (pos, node, isHorizontal, offsetX, offsetY) => {
  return {
    x: pos.x - (node.measured?.width ?? NODE_WIDTH) / 2 + (isHorizontal ? 0 : offsetX),
    y: pos.y - (node.measured?.height ?? NODE_HEIGHT) / 2 + (isHorizontal ? offsetY : 0),
  };
};

export const getLayout = (nodes, edges, direction) => {
  const isHorizontal = direction === 'LR';

  const connectedNodeIds = new Set(edges.flatMap(edge => [edge.source, edge.target]));
  const connectedNodes = nodes.filter(node => connectedNodeIds.has(node.id));
  const nonConnectedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));

  const g = new Dagre.graphlib.Graph({ multigraph: true })
    .setDefaultEdgeLabel(() => ({}))
    .setGraph({
      rankdir: direction,
      nodesep: 30,   // сузил расстояния между узлами
      edgesep: 15,   // немного больше чтобы линии не пересекались
      ranksep: 70,
      marginx: 20,
      marginy: 20,
      acyclicer: 'greedy',
    });

  connectedNodes.forEach(node => {
    g.setNode(node.id, {
      width: node.measured?.width ?? NODE_WIDTH,
      height: node.measured?.height ?? NODE_HEIGHT,
    });
  });

  edges.forEach(edge => {
    // Если есть дубли, можно фильтровать заранее, но пока добавим все
    g.setEdge(edge.source, edge.target);
  });

  Dagre.layout(g);

  const layoutNodes = nodes.map(node => {
    if (connectedNodeIds.has(node.id)) {
      const pos = g.node(node.id);
      if (!pos) return null;

      const { x, y } = calculateNodePosition(pos, node, isHorizontal, 0, 0);

      return {
        ...node,
        position: { x, y },
        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
        data: { ...node.data, isHorizontal },
      };
    }
    return null;
  }).filter(Boolean);

  // Размещаем несвязанные узлы ниже (или правее) связанных
  let nonConnectedIndex = 0;
  const nonConnectedLayoutNodes = nonConnectedNodes.map(node => {
    const column = nonConnectedIndex % GRID_COLUMNS;
    const row = Math.floor(nonConnectedIndex / GRID_COLUMNS);

    const x = column * (NODE_WIDTH + HORIZONTAL_OFFSET);
    const y = row * (NODE_HEIGHT + VERTICAL_OFFSET);

    nonConnectedIndex++;

    return {
      ...node,
      position: { x, y },
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      data: { ...node.data, isHorizontal },
    };
  });

  const xOffset = 0;
  const yOffset = connectedNodes.length ? Math.max(...layoutNodes.map(node => node.position.y + NODE_HEIGHT)) + VERTICAL_OFFSET : 0;

  nonConnectedLayoutNodes.forEach(node => {
    node.position.x += xOffset;
    node.position.y += yOffset;
  });

  return { nodes: [...layoutNodes, ...nonConnectedLayoutNodes], edges };
};
