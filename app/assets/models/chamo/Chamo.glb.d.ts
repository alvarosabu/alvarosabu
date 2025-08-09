import type { Bone, Group, Mesh, Object3D, SkinnedMesh } from "three";

declare const path: unique symbol;

export const SceneScene: {
  [path]: [0];
  Chamo_Rig: {
    [path]: [0, 0];
    Chamo_Arms: {
      [path]: [0, 0, 0];
      Cube012: {
        [path]: [0, 0, 0, 0];
      };
      Cube012_1: {
        [path]: [0, 0, 0, 1];
      };
    };
    Chamo_Hands: {
      [path]: [0, 0, 1];
    };
    Chamo_Head: {
      [path]: [0, 0, 2];
      Cube009: {
        [path]: [0, 0, 2, 0];
      };
      Cube009_1: {
        [path]: [0, 0, 2, 1];
      };
      Cube009_2: {
        [path]: [0, 0, 2, 2];
      };
    };
    Chamo_Legs: {
      [path]: [0, 0, 3];
    };
    Chamo_Shirt_Tres: {
      [path]: [0, 0, 4];
    };
    Chamo_Shoes: {
      [path]: [0, 0, 5];
    };
    Chamo_Shorts: {
      [path]: [0, 0, 6];
    };
    root: {
      [path]: [0, 0, 7];
      hips: {
        [path]: [0, 0, 7, 0];
        spine: {
          [path]: [0, 0, 7, 0, 0];
          chest: {
            [path]: [0, 0, 7, 0, 0, 0];
            upperarml: {
              [path]: [0, 0, 7, 0, 0, 0, 0];
              lowerarml: {
                [path]: [0, 0, 7, 0, 0, 0, 0, 0];
                wristl: {
                  [path]: [0, 0, 7, 0, 0, 0, 0, 0, 0];
                  handl: {
                    [path]: [0, 0, 7, 0, 0, 0, 0, 0, 0, 0];
                    handslotl: {
                      [path]: [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0];
                    };
                  };
                };
              };
            };
            upperarmr: {
              [path]: [0, 0, 7, 0, 0, 0, 1];
              lowerarmr: {
                [path]: [0, 0, 7, 0, 0, 0, 1, 0];
                wristr: {
                  [path]: [0, 0, 7, 0, 0, 0, 1, 0, 0];
                  handr: {
                    [path]: [0, 0, 7, 0, 0, 0, 1, 0, 0, 0];
                    handslotr: {
                      [path]: [0, 0, 7, 0, 0, 0, 1, 0, 0, 0, 0];
                    };
                  };
                };
              };
            };
            head: {
              [path]: [0, 0, 7, 0, 0, 0, 2];
              face: {
                [path]: [0, 0, 7, 0, 0, 0, 2, 0];
                eyeselectorbase: {
                  [path]: [0, 0, 7, 0, 0, 0, 2, 0, 0];
                  eyeselector: {
                    [path]: [0, 0, 7, 0, 0, 0, 2, 0, 0, 0];
                  };
                };
              };
              Chamo_Base_Hair: {
                [path]: [0, 0, 7, 0, 0, 0, 2, 1];
              };
              Chamo_Earring_Cross: {
                [path]: [0, 0, 7, 0, 0, 0, 2, 2];
              };
              Chamo_Ears: {
                [path]: [0, 0, 7, 0, 0, 0, 2, 3];
              };
              Chamo_Long_Hair: {
                [path]: [0, 0, 7, 0, 0, 0, 2, 4];
              };
            };
          };
        };
        upperlegl: {
          [path]: [0, 0, 7, 0, 1];
          lowerlegl: {
            [path]: [0, 0, 7, 0, 1, 0];
            footl: {
              [path]: [0, 0, 7, 0, 1, 0, 0];
              toesl: {
                [path]: [0, 0, 7, 0, 1, 0, 0, 0];
              };
            };
          };
        };
        upperlegr: {
          [path]: [0, 0, 7, 0, 2];
          lowerlegr: {
            [path]: [0, 0, 7, 0, 2, 0];
            footr: {
              [path]: [0, 0, 7, 0, 2, 0, 0];
              toesr: {
                [path]: [0, 0, 7, 0, 2, 0, 0, 0];
              };
            };
          };
        };
      };
      knee_I_Kl: {
        [path]: [0, 0, 7, 1];
      };
      control_toe_rolll: {
        [path]: [0, 0, 7, 2];
        control_heel_rolll: {
          [path]: [0, 0, 7, 2, 0];
          control_foot_rolll: {
            [path]: [0, 0, 7, 2, 0, 0];
            heel_I_Kl: {
              [path]: [0, 0, 7, 2, 0, 0, 0];
            };
            IK_footl: {
              [path]: [0, 0, 7, 2, 0, 0, 1];
            };
          };
          IK_toel: {
            [path]: [0, 0, 7, 2, 0, 1];
          };
        };
      };
      knee_I_Kr: {
        [path]: [0, 0, 7, 3];
      };
      control_toe_rollr: {
        [path]: [0, 0, 7, 4];
        control_heel_rollr: {
          [path]: [0, 0, 7, 4, 0];
          control_foot_rollr: {
            [path]: [0, 0, 7, 4, 0, 0];
            heel_I_Kr: {
              [path]: [0, 0, 7, 4, 0, 0, 0];
            };
            IK_footr: {
              [path]: [0, 0, 7, 4, 0, 0, 1];
            };
          };
          IK_toer: {
            [path]: [0, 0, 7, 4, 0, 1];
          };
        };
      };
      elbow_I_Kl: {
        [path]: [0, 0, 7, 5];
      };
      hand_I_Kl: {
        [path]: [0, 0, 7, 6];
      };
      elbow_I_Kr: {
        [path]: [0, 0, 7, 7];
      };
      hand_I_Kr: {
        [path]: [0, 0, 7, 8];
      };
    };
  };
};

export function getNode(spec: typeof SceneScene): Promise<Group>;
export function getNode(spec: typeof SceneScene.Chamo_Rig): Promise<Object3D>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Arms): Promise<Group>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Arms.Cube012): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Arms.Cube012_1): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Hands): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Head): Promise<Group>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Head.Cube009): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Head.Cube009_1): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Head.Cube009_2): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Legs): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Shirt_Tres): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Shoes): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.Chamo_Shorts): Promise<SkinnedMesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.upperarml): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.upperarml.lowerarml): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.upperarml.lowerarml.wristl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.upperarml.lowerarml.wristl.handl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.upperarml.lowerarml.wristl.handl.handslotl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.upperarmr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.upperarmr.lowerarmr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.upperarmr.lowerarmr.wristr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.upperarmr.lowerarmr.wristr.handr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.upperarmr.lowerarmr.wristr.handr.handslotr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.head): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.head.face): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.head.face.eyeselectorbase): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.head.face.eyeselectorbase.eyeselector): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.head.Chamo_Base_Hair): Promise<Mesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.head.Chamo_Earring_Cross): Promise<Mesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.head.Chamo_Ears): Promise<Mesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.spine.chest.head.Chamo_Long_Hair): Promise<Mesh>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.upperlegl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.upperlegl.lowerlegl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.upperlegl.lowerlegl.footl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.upperlegl.lowerlegl.footl.toesl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.upperlegr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.upperlegr.lowerlegr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.upperlegr.lowerlegr.footr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hips.upperlegr.lowerlegr.footr.toesr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.knee_I_Kl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rolll): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rolll.control_heel_rolll): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rolll.control_heel_rolll.control_foot_rolll): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rolll.control_heel_rolll.control_foot_rolll.heel_I_Kl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rolll.control_heel_rolll.control_foot_rolll.IK_footl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rolll.control_heel_rolll.IK_toel): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.knee_I_Kr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rollr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rollr.control_heel_rollr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rollr.control_heel_rollr.control_foot_rollr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rollr.control_heel_rollr.control_foot_rollr.heel_I_Kr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rollr.control_heel_rollr.control_foot_rollr.IK_footr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.control_toe_rollr.control_heel_rollr.IK_toer): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.elbow_I_Kl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hand_I_Kl): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.elbow_I_Kr): Promise<Bone>;
export function getNode(spec: typeof SceneScene.Chamo_Rig.root.hand_I_Kr): Promise<Bone>;

export {};
