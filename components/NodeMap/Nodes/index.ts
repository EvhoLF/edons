import NodeCode from "./NodeCode/NodeCode";
import NodeShape from "./NodeShape/NodeShape";
import NodeTable from "./NodeTable/NodeTable";

export const nodeTypes = {
  shape: NodeShape,
  table: NodeTable,
  code: NodeCode,
};

export const GetNodeColor = (node : any) => node.data.color ?? '#eef';
export const GetNodeColorBG = (node : any) => node.data.colorBG ?? '#2a2b2f';