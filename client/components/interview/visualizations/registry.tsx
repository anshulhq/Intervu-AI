"use client";

import React from "react";
import { LinkedListVisualization } from "../LinkedListVisualization";

type VisualizationComponent = React.ComponentType;

const registry: Record<string, VisualizationComponent> = {
  "linked-list-reversal": LinkedListVisualization,
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
