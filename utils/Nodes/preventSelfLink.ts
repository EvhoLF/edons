import { Connection } from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";

export const preventSelfLink = (e: EdgeBase | Connection) => e.source != e.target;