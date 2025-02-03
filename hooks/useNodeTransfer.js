import { useNodeConnections, useNodesData } from '@xyflow/react';

const useNodeTransfer = () => {
  const connectionsSource = useNodeConnections({ handleType: 'source' });
  // const connectionsTarget = useNodeConnections({ handleType: 'target' });
  console.log(connectionsSource);

  const nodesDataSource = useNodesData(connectionsSource.map((c) => c.source));
  // const nodesDataTarget = useNodesData(connectionsTarget.map((c) => c.target));

  const getSourceData = (filter = null) => filter ? nodesDataSource.filter(filter) : nodesDataSource;

  return { getSourceData };
};

export default useNodeTransfer;
