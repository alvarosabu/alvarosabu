import type { Group, Mesh } from "three";

declare const path: unique symbol;

export const SceneScene: {
  [path]: [0];
  Planet: {
    [path]: [0, 0];
    Icosphere: {
      [path]: [0, 0, 0];
    };
    Icosphere_1: {
      [path]: [0, 0, 1];
    };
  };
};

export function getNode(spec: typeof SceneScene): Promise<Group>;
export function getNode(spec: typeof SceneScene.Planet): Promise<Group>;
export function getNode(spec: typeof SceneScene.Planet.Icosphere): Promise<Mesh>;
export function getNode(spec: typeof SceneScene.Planet.Icosphere_1): Promise<Mesh>;

export {};
