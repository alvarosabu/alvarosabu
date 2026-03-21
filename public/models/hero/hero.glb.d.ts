import type { Bone, Group, Object3D, SkinnedMesh } from "three";

declare const path: unique symbol;

export const SceneScene: {
  [path]: [0];
  Rig_Medium: {
    [path]: [0, 0];
    Hero_Arm_Left: {
      [path]: [0, 0, 0];
    };
    Hero_Arm_Right: {
      [path]: [0, 0, 1];
      Ranger_Arm_Right: {
        [path]: [0, 0, 1, 0];
      };
      Ranger_Arm_Right_1: {
        [path]: [0, 0, 1, 1];
      };
    };
    Hero_Body: {
      [path]: [0, 0, 2];
    };
    Hero_Cape: {
      [path]: [0, 0, 3];
    };
    Hero_Hair: {
      [path]: [0, 0, 4];
    };
    Hero_Head: {
      [path]: [0, 0, 5];
    };
    Hero_Leg_Left: {
      [path]: [0, 0, 6];
    };
    Hero_Leg_Right: {
      [path]: [0, 0, 7];
    };
    Ranger_Hair001: {
      [path]: [0, 0, 8];
    };
    Ranger_Hair002: {
      [path]: [0, 0, 9];
    };
    root: {
      [path]: [0, 0, 10];
      hips: {
        [path]: [0, 0, 10, 0];
        spine: {
          [path]: [0, 0, 10, 0, 0];
          chest: {
            [path]: [0, 0, 10, 0, 0, 0];
            upperarml: {
              [path]: [0, 0, 10, 0, 0, 0, 0];
              lowerarml: {
                [path]: [0, 0, 10, 0, 0, 0, 0, 0];
                wristl: {
                  [path]: [0, 0, 10, 0, 0, 0, 0, 0, 0];
                  handl: {
                    [path]: [0, 0, 10, 0, 0, 0, 0, 0, 0, 0];
                    handslotl: {
                      [path]: [0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0];
                    };
                  };
                };
              };
            };
            upperarmr: {
              [path]: [0, 0, 10, 0, 0, 0, 1];
              lowerarmr: {
                [path]: [0, 0, 10, 0, 0, 0, 1, 0];
                wristr: {
                  [path]: [0, 0, 10, 0, 0, 0, 1, 0, 0];
                  handr: {
                    [path]: [0, 0, 10, 0, 0, 0, 1, 0, 0, 0];
                    handslotr: {
                      [path]: [0, 0, 10, 0, 0, 0, 1, 0, 0, 0, 0];
                    };
                  };
                };
              };
            };
            head: {
              [path]: [0, 0, 10, 0, 0, 0, 2];
            };
          };
        };
        upperlegl: {
          [path]: [0, 0, 10, 0, 1];
          lowerlegl: {
            [path]: [0, 0, 10, 0, 1, 0];
            footl: {
              [path]: [0, 0, 10, 0, 1, 0, 0];
              toesl: {
                [path]: [0, 0, 10, 0, 1, 0, 0, 0];
              };
            };
          };
        };
        upperlegr: {
          [path]: [0, 0, 10, 0, 2];
          lowerlegr: {
            [path]: [0, 0, 10, 0, 2, 0];
            footr: {
              [path]: [0, 0, 10, 0, 2, 0, 0];
              toesr: {
                [path]: [0, 0, 10, 0, 2, 0, 0, 0];
              };
            };
          };
        };
      };
      knee_I_Kl: {
        [path]: [0, 0, 10, 1];
      };
      control_toe_rolll: {
        [path]: [0, 0, 10, 2];
        control_heel_rolll: {
          [path]: [0, 0, 10, 2, 0];
          control_foot_rolll: {
            [path]: [0, 0, 10, 2, 0, 0];
            heel_I_Kl: {
              [path]: [0, 0, 10, 2, 0, 0, 0];
            };
            IK_footl: {
              [path]: [0, 0, 10, 2, 0, 0, 1];
            };
          };
          IK_toel: {
            [path]: [0, 0, 10, 2, 0, 1];
          };
        };
      };
      knee_I_Kr: {
        [path]: [0, 0, 10, 3];
      };
      control_toe_rollr: {
        [path]: [0, 0, 10, 4];
        control_heel_rollr: {
          [path]: [0, 0, 10, 4, 0];
          control_foot_rollr: {
            [path]: [0, 0, 10, 4, 0, 0];
            heel_I_Kr: {
              [path]: [0, 0, 10, 4, 0, 0, 0];
            };
            IK_footr: {
              [path]: [0, 0, 10, 4, 0, 0, 1];
            };
          };
          IK_toer: {
            [path]: [0, 0, 10, 4, 0, 1];
          };
        };
      };
      elbow_I_Kl: {
        [path]: [0, 0, 10, 5];
      };
      hand_I_Kl: {
        [path]: [0, 0, 10, 6];
      };
      elbow_I_Kr: {
        [path]: [0, 0, 10, 7];
      };
      hand_I_Kr: {
        [path]: [0, 0, 10, 8];
      };
    };
  };
};

export function getNode(spec: typeof SceneScene): Promise<Group>;
export function getNode(spec: typeof SceneScene.Rig_Medium): Promise<Object3D>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Hero_Arm_Left): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Hero_Arm_Right): Promise<Group>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Hero_Arm_Right.Ranger_Arm_Right): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Hero_Arm_Right.Ranger_Arm_Right_1): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Hero_Body): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Hero_Cape): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Hero_Hair): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Hero_Head): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Hero_Leg_Left): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Hero_Leg_Right): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Ranger_Hair001): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.Ranger_Hair002): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips): Promise<Bone>;
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
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegl.lowerlegl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegl.lowerlegl.footl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegl.lowerlegl.footl.toesl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegr.lowerlegr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegr.lowerlegr.footr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hips.upperlegr.lowerlegr.footr.toesr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.knee_I_Kl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rolll): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rolll.control_heel_rolll): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rolll.control_heel_rolll.control_foot_rolll): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rolll.control_heel_rolll.control_foot_rolll.heel_I_Kl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rolll.control_heel_rolll.control_foot_rolll.IK_footl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rolll.control_heel_rolll.IK_toel): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.knee_I_Kr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rollr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rollr.control_heel_rollr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rollr.control_heel_rollr.control_foot_rollr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rollr.control_heel_rollr.control_foot_rollr.heel_I_Kr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rollr.control_heel_rollr.control_foot_rollr.IK_footr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.control_toe_rollr.control_heel_rollr.IK_toer): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.elbow_I_Kl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hand_I_Kl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.elbow_I_Kr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Rig_Medium.root.hand_I_Kr): Promise<Bone>;

export {};
