import type { Group, Mesh } from "three";

declare const path: unique symbol;

export const SceneScene: {
  [path]: [0];
  Skull_Flowers: {
    [path]: [0, 0];
  };
};

export function getNode(spec: typeof SceneScene): Promise<Group>;
export function getNode(spec: typeof SceneScene.Skull_Flowers): Promise<Mesh>;

export {};
