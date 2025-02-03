import { getHelperLines } from "@/utils/Nodes/getHelperLines";
import { applyNodeChanges, Node, NodeChange } from "@xyflow/react";
import { useCallback, useState } from "react";

const useHelperLines = () => {
  const [helperLineHorizontal, setHelperLineHorizontal] = useState<number | undefined>(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<number | undefined>(undefined);

  const HelperLines_ApplyNodeChanges = useCallback(
    (changes: NodeChange[], nodes: Node[]): Node[] => {
      setHelperLineHorizontal(undefined);
      setHelperLineVertical(undefined);

      if (changes.length === 1 && changes[0].type === "position" && changes[0].dragging && changes[0].position) {
        const helperLines = getHelperLines(changes[0], nodes);
        changes[0].position.x = helperLines.snapPosition.x ?? changes[0].position.x;
        changes[0].position.y = helperLines.snapPosition.y ?? changes[0].position.y;
        setHelperLineHorizontal(helperLines.horizontal);
        setHelperLineVertical(helperLines.vertical);
      }

      return applyNodeChanges(changes, nodes);
    },
    []
  );

  return [helperLineHorizontal, helperLineVertical, HelperLines_ApplyNodeChanges] as const;
};

export default useHelperLines;