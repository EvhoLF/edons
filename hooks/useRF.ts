import { ReactFlowInstance, useNodes, useReactFlow } from "@xyflow/react";

type getNodeSelected = () => any;
// eslint-disable-next-line no-unused-vars
type getNodeDataField = (id: string, field: string) => any; 

interface CustomReactFlowInstance extends ReactFlowInstance {
  getNodeSelected: getNodeSelected; // Укажите точный тип возвращаемого значения, если он известен
  getNodeDataField: getNodeDataField
}

const useRF = (): CustomReactFlowInstance => {
  const reactFlow = useReactFlow();
  const nodes = useNodes();

  const getNodeSelected: getNodeSelected = () => nodes.find((node) => node.selected);
  const getNodeDataField: getNodeDataField = (id, field) => reactFlow.getNode(id)?.data?.[field] ?? null;

  return { ...reactFlow, getNodeSelected, getNodeDataField }

}

export default useRF