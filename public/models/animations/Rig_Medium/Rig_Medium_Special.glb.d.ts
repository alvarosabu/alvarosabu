import type { Bone, Group, Object3D, SkinnedMesh } from "three";

declare const path: unique symbol;

export const SceneScene: {
  [path]: [0];
  Rig_Medium: {
    [path]: [0, 0];
    Mannequin_Arm_Left: {
      [path]: [0, 0, 0];
    };
    Mannequin_Arm_Right: {
      [path]: [0, 0, 1];
    };
    Mannequin_Body: {
      [path]: [0, 0, 2];
    };
    Mannequin_Head: {
      [path]: [0, 0, 3];
    };
    Mannequin_Leg_Left: {
      [path]: [0, 0, 4];
    };
    Mannequin_Leg_Right: {
      [path]: [0, 0, 5];
    };
    root: {
      [path]: [0, 0, 6];
      hips: {
        [path]: [0, 0, 6, 0];
        upperlegr: {
          [path]: [0, 0, 6, 0, 0];
          lowerlegr: {
            [path]: [0, 0, 6, 0, 0, 0];
            footr: {
              [path]: [0, 0, 6, 0, 0, 0, 0];
              toesr: {
                [path]: [0, 0, 6, 0, 0, 0, 0, 0];
              };
            };
          };
        };
        upperlegl: {
          [path]: [0, 0, 6, 0, 1];
          lowerlegl: {
            [path]: [0, 0, 6, 0, 1, 0];
            footl: {
              [path]: [0, 0, 6, 0, 1, 0, 0];
              toesl: {
                [path]: [0, 0, 6, 0, 1, 0, 0, 0];
              };
            };
          };
        };
        spine: {
          [path]: [0, 0, 6, 0, 2];
          chest: {
            [path]: [0, 0, 6, 0, 2, 0];
            upperarml: {
              [path]: [0, 0, 6, 0, 2, 0, 0];
              lowerarml: {
                [path]: [0, 0, 6, 0, 2, 0, 0, 0];
                wristl: {
                  [path]: [0, 0, 6, 0, 2, 0, 0, 0, 0];
                  handl: {
                    [path]: [0, 0, 6, 0, 2, 0, 0, 0, 0, 0];
                    handslotl: {
                      [path]: [0, 0, 6, 0, 2, 0, 0, 0, 0, 0, 0];
                    };
                  };
                };
              };
            };
            upperarmr: {
              [path]: [0, 0, 6, 0, 2, 0, 1];
              lowerarmr: {
                [path]: [0, 0, 6, 0, 2, 0, 1, 0];
                wristr: {
                  [path]: [0, 0, 6, 0, 2, 0, 1, 0, 0];
                  handr: {
                    [path]: [0, 0, 6, 0, 2, 0, 1, 0, 0, 0];
                    handslotr: {
                      [path]: [0, 0, 6, 0, 2, 0, 1, 0, 0, 0, 0];
                    };
                  };
                };
              };
            };
            head: {
              [path]: [0, 0, 6, 0, 2, 0, 2];
            };
          };
        };
      };
    };
  };
};

export function getNode(spec: typeof SceneScene): Promise<Group>;
export function getNode(spec: typeof SceneScene.Rig_Medium): Promise<Object3D>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Mannequin_Arm_Left): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Mannequin_Arm_Right): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Mannequin_Body): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Mannequin_Head): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Mannequin_Leg_Left): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Mannequin_Leg_Right): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegr.lowerlegr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegr.lowerlegr.footr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegr.lowerlegr.footr.toesr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegl.lowerlegl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegl.lowerlegl.footl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegl.lowerlegl.footl.toesl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.upperarml): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.upperarml.lowerarml): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.upperarml.lowerarml.wristl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.upperarml.lowerarml.wristl.handl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.upperarml.lowerarml.wristl.handl.handslotl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.upperarmr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.upperarmr.lowerarmr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.upperarmr.lowerarmr.wristr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.upperarmr.lowerarmr.wristr.handr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.upperarmr.lowerarmr.wristr.handr.handslotr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.spine.chest.head): Promise<Bone>;

export {};
