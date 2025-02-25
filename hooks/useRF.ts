import { ReactFlowInstance, useNodes, useReactFlow } from "@xyflow/react";

type GetNodeSelected = () => ReturnType<typeof useNodes>[number] | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetNodeDataField = (id: string, field: string) => any; // Уточните тип возвращаемого значения, если он известен

interface CustomReactFlowInstance extends ReactFlowInstance {
  getNodeSelected: GetNodeSelected;
  getNodeDataField: GetNodeDataField;
}

const useRF = (): CustomReactFlowInstance => {
  const reactFlow = useReactFlow();
  const nodes = useNodes();

  const getNodeSelected: GetNodeSelected = () => nodes.find((node) => node.selected);
  const getNodeDataField: GetNodeDataField = (id, field) => reactFlow.getNode(id)?.data?.[field] ?? null;

  return { ...reactFlow, getNodeSelected, getNodeDataField };
};

export default useRF;