// "use clinet"
import { BezierEdge, SimpleBezierEdge, SmoothStepEdge, StepEdge, StraightEdge } from "@xyflow/react";
import EdgeBezier from "./EdgeBezier/EdgeBezier";

export const edgeTypes = {
  bezier: EdgeBezier,
  bezierEdge: BezierEdge,
  simpleBezierEdge:SimpleBezierEdge,
  smoothStepEdge: SmoothStepEdge,
  stepEdge: StepEdge,
  straightEdge: StraightEdge,
};