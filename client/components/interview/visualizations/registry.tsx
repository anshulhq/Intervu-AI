"use client";

import React from "react";
import { LinkedListVisualization } from "../LinkedListVisualization";
import { LinkedListCycleVisualization } from "../LinkedListCycleVisualization";
import { RotateArrayVisualization } from "../RotateArrayVisualization";
import { LargestRectangleVisualization } from "../LargestRectangleVisualization";
import { UniquePathsVisualization } from "../UniquePathsVisualization";
import { PowVisualization } from "../PowVisualization";
import { CountHoursCompleteDayVisualization } from "../CountHoursCompleteDayVisualization";
import { FirstMissingPositiveVisualization } from "../FirstMissingPositiveVisualization";
import { KthLargestElementVisualization } from "../KthLargestElementVisualization";
import { DiamondPatternVisualization } from "../DiamondPatternVisualization";
import { LevelOrderTraversalVisualization } from "../LevelOrderTraversalVisualization";
import { ContainerMostWaterVisualization } from "../ContainerMostWaterVisualization";
import { InvertBinaryTreeVisualization } from "../InvertBinaryTreeVisualization";
import { CountInversionsVisualization } from "../CountInversionsVisualization";
import { ReorderListVisualization } from "../ReorderListVisualization";
import { MedianTwoSortedArraysVisualization } from "../MedianTwoSortedArraysVisualization";

type VisualizationComponent = React.ComponentType;

const registry: Record<string, VisualizationComponent> = {
  "linked-list-reversal": LinkedListVisualization,
  "linked-list-cycle": LinkedListCycleVisualization,
  "rotate-array": RotateArrayVisualization,
  "largest-rectangle-in-histogram": LargestRectangleVisualization,
  "unique-paths": UniquePathsVisualization,
  "pow-x-n": PowVisualization,
  "count-hours-complete-day": CountHoursCompleteDayVisualization,
  "first-missing-positive": FirstMissingPositiveVisualization,
  "kth-largest-element": KthLargestElementVisualization,
  "print-diamond-pattern": DiamondPatternVisualization,
  "level-order-traversal": LevelOrderTraversalVisualization,
  "container-with-most-water": ContainerMostWaterVisualization,
  "invert-binary-tree": InvertBinaryTreeVisualization,
  "count-inversions": CountInversionsVisualization,
  "reorder-linked-list": ReorderListVisualization,
  "median-two-sorted-arrays": MedianTwoSortedArraysVisualization,
};

/**
 * Register a visualization component for a given key.
 * Call this at module level in your visualization file:
 *
 *   import { registerVisualization } from "./registry";
 *   registerVisualization("my-viz-key", MyVizComponent);
 */
export function registerVisualization(
  key: string,
  component: VisualizationComponent
) {
  registry[key] = component;
}

/**
 * Look up a visualization by key. Returns null if none is registered.
 */
export function getVisualization(
  key?: string
): VisualizationComponent | null {
  if (!key) return null;
  return registry[key] ?? null;
}
