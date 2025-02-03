import { Node, NodePositionChange, XYPosition } from '@xyflow/react';

type GetHelperLinesResult = {
  horizontal?: number;
  vertical?: number;
  snapPosition: Partial<XYPosition>;
};

export function getHelperLines(
  change: NodePositionChange,
  nodes: Node[],
  distance = 5
): GetHelperLinesResult {
  const defaultResult = {
    horizontal: undefined,
    vertical: undefined,
    snapPosition: { x: undefined, y: undefined },
  };

  const nodeA = nodes.find((node) => node.id === change.id);

  if (!nodeA || !change.position) { return defaultResult; }

  const nodeABounds = {
    left: change.position.x,
    right: change.position.x + (nodeA.measured?.width ?? 0),
    top: change.position.y,
    bottom: change.position.y + (nodeA.measured?.height ?? 0),
    width: nodeA.measured?.width ?? 0,
    height: nodeA.measured?.height ?? 0,
    centerX: change.position.x + (nodeA.measured?.width ?? 0) / 2,
    centerY: change.position.y + (nodeA.measured?.height ?? 0) / 2,
  };

  let horizontalDistance = distance;
  let verticalDistance = distance;

  return nodes
    .filter((node) => node.id !== nodeA.id)
    .reduce<GetHelperLinesResult>((result, nodeB) => {
      const nodeBBounds = {
        left: nodeB.position.x,
        right: nodeB.position.x + (nodeB.measured?.width ?? 0),
        top: nodeB.position.y,
        bottom: nodeB.position.y + (nodeB.measured?.height ?? 0),
        width: nodeB.measured?.width ?? 0,
        height: nodeB.measured?.height ?? 0,
        centerX: nodeB.position.x + (nodeB.measured?.width ?? 0) / 2,
        centerY: nodeB.position.y + (nodeB.measured?.height ?? 0) / 2,
      };

      const distanceCenterX = Math.abs(nodeABounds.centerX - nodeBBounds.centerX);
      if (distanceCenterX < verticalDistance) {
        result.snapPosition.x = nodeBBounds.centerX - nodeABounds.width / 2;
        result.vertical = nodeBBounds.centerX;
        verticalDistance = distanceCenterX;
      }

      const distanceCenterY = Math.abs(nodeABounds.centerY - nodeBBounds.centerY);
      if (distanceCenterY < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.centerY - nodeABounds.height / 2;
        result.horizontal = nodeBBounds.centerY;
        horizontalDistance = distanceCenterY;
      }

      const distanceCenterXLeft = Math.abs(nodeABounds.centerX - nodeBBounds.left);
      if (distanceCenterXLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left - nodeABounds.width / 2;
        result.vertical = nodeBBounds.left;
        verticalDistance = distanceCenterXLeft;
      }

      const distanceCenterXRight = Math.abs(nodeABounds.centerX - nodeBBounds.right);
      if (distanceCenterXRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right - nodeABounds.width / 2;
        result.vertical = nodeBBounds.right;
        verticalDistance = distanceCenterXRight;
      }

      const distanceCenterYTop = Math.abs(nodeABounds.centerY - nodeBBounds.top);
      if (distanceCenterYTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top - nodeABounds.height / 2;
        result.horizontal = nodeBBounds.top;
        horizontalDistance = distanceCenterYTop;
      }

      const distanceCenterYBottom = Math.abs(nodeABounds.centerY - nodeBBounds.bottom);
      if (distanceCenterYBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom - nodeABounds.height / 2;
        result.horizontal = nodeBBounds.bottom;
        horizontalDistance = distanceCenterYBottom;
      }

      const distanceLeftLeft = Math.abs(nodeABounds.left - nodeBBounds.left);
      if (distanceLeftLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left;
        result.vertical = nodeBBounds.left;
        verticalDistance = distanceLeftLeft;
      }

      const distanceRightRight = Math.abs(nodeABounds.right - nodeBBounds.right);
      if (distanceRightRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right - nodeABounds.width;
        result.vertical = nodeBBounds.right;
        verticalDistance = distanceRightRight;
      }

      const distanceLeftRight = Math.abs(nodeABounds.left - nodeBBounds.right);
      if (distanceLeftRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right;
        result.vertical = nodeBBounds.right;
        verticalDistance = distanceLeftRight;
      }

      const distanceRightLeft = Math.abs(nodeABounds.right - nodeBBounds.left);
      if (distanceRightLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left - nodeABounds.width;
        result.vertical = nodeBBounds.left;
        verticalDistance = distanceRightLeft;
      }

      const distanceTopTop = Math.abs(nodeABounds.top - nodeBBounds.top);
      if (distanceTopTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top;
        result.horizontal = nodeBBounds.top;
        horizontalDistance = distanceTopTop;
      }

      const distanceBottomTop = Math.abs(nodeABounds.bottom - nodeBBounds.top);
      if (distanceBottomTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top - nodeABounds.height;
        result.horizontal = nodeBBounds.top;
        horizontalDistance = distanceBottomTop;
      }

      const distanceBottomBottom = Math.abs(nodeABounds.bottom - nodeBBounds.bottom);
      if (distanceBottomBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom - nodeABounds.height;
        result.horizontal = nodeBBounds.bottom;
        horizontalDistance = distanceBottomBottom;
      }

      const distanceTopBottom = Math.abs(nodeABounds.top - nodeBBounds.bottom);
      if (distanceTopBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom;
        result.horizontal = nodeBBounds.bottom;
        horizontalDistance = distanceTopBottom;
      }

      return result;
    }, defaultResult);
}