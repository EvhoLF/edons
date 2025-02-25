import { getHelperLines } from "@/utils/Nodes/getHelperLines";
import { applyNodeChanges, Node, NodeChange } from "@xyflow/react";
import { useCallback, useState } from "react";

const useHelperLines = () => {
  const [helperLineHorizontal, setHelperLineHorizontal] = useState<number | undefined>();
  const [helperLineVertical, setHelperLineVertical] = useState<number | undefined>();

  const applyHelperLinesChanges = useCallback(
    (changes: NodeChange[], nodes: Node[]): Node[] => {
      setHelperLineHorizontal(undefined);
      setHelperLineVertical(undefined);

      if (changes.length === 1) {
        const [change] = changes;
        if (change.type === "position" && change.dragging && change.position) {
          const { snapPosition, horizontal, vertical } = getHelperLines(change, nodes);

          change.position.x = snapPosition.x ?? change.position.x;
          change.position.y = snapPosition.y ?? change.position.y;

          setHelperLineHorizontal(horizontal);
          setHelperLineVertical(vertical);
        }
      }

      return applyNodeChanges(changes, nodes);
    },
    []
  );

  return [helperLineHorizontal, helperLineVertical, applyHelperLinesChanges] as const;
};

export default useHelperLines;
