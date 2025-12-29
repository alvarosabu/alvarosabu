import type { Group, Mesh, Object3D } from "three";

declare const path: unique symbol;

export const Sketchfab_SceneScene: {
  [path]: [0];
  Sketchfab_model: {
    [path]: [0, 0];
    cab68025621d449ca96e0e4fba5325d6fbx: {
      [path]: [0, 0, 0];
      Root_Node: {
        [path]: [0, 0, 0, 0];
        sweep15: {
          [path]: [0, 0, 0, 0, 0];
          poly_Surface58: {
            [path]: [0, 0, 0, 0, 0, 0];
            poly_Surface58_lambert3_0: {
              [path]: [0, 0, 0, 0, 0, 0, 0];
            };
          };
        };
        poly_Surface49: {
          [path]: [0, 0, 0, 0, 1];
          poly_Surface49_ai_Standard_Surface1_0: {
            [path]: [0, 0, 0, 0, 1, 0];
          };
        };
        poly_Surface68: {
          [path]: [0, 0, 0, 0, 2];
          poly_Surface68_ai_Standard_Surface2_0: {
            [path]: [0, 0, 0, 0, 2, 0];
          };
        };
        poly_Surface81: {
          [path]: [0, 0, 0, 0, 3];
          poly_Surface81_ai_Standard_Surface4_0: {
            [path]: [0, 0, 0, 0, 3, 0];
          };
        };
        poly_Surface55: {
          [path]: [0, 0, 0, 0, 4];
          poly_Surface55_lambert3_0: {
            [path]: [0, 0, 0, 0, 4, 0];
          };
        };
        poly_Surface76: {
          [path]: [0, 0, 0, 0, 5];
          poly_Surface76_ai_Standard_Surface3_0: {
            [path]: [0, 0, 0, 0, 5, 0];
          };
        };
      };
    };
  };
};

export function getNode(spec: typeof Sketchfab_SceneScene): Promise<Group>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model): Promise<Object3D>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx): Promise<Object3D>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node): Promise<Object3D>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.sweep15): Promise<Object3D>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.sweep15.poly_Surface58): Promise<Object3D>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.sweep15.poly_Surface58.poly_Surface58_lambert3_0): Promise<Mesh>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.poly_Surface49): Promise<Object3D>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.poly_Surface49.poly_Surface49_ai_Standard_Surface1_0): Promise<Mesh>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.poly_Surface68): Promise<Object3D>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.poly_Surface68.poly_Surface68_ai_Standard_Surface2_0): Promise<Mesh>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.poly_Surface81): Promise<Object3D>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.poly_Surface81.poly_Surface81_ai_Standard_Surface4_0): Promise<Mesh>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.poly_Surface55): Promise<Object3D>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.poly_Surface55.poly_Surface55_lambert3_0): Promise<Mesh>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.poly_Surface76): Promise<Object3D>;
export function getNode(spec: typeof Sketchfab_SceneScene.Sketchfab_model.cab68025621d449ca96e0e4fba5325d6fbx.Root_Node.poly_Surface76.poly_Surface76_ai_Standard_Surface3_0): Promise<Mesh>;

export {};
