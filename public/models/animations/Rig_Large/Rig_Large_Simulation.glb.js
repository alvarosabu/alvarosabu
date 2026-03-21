import gltfLoader from "@todde.tv/gltf-type-toolkit/gltf-loader";
import gltfPath from "./Rig_Large_Simulation.glb";

const path = Symbol();

export const SceneScene = {
  [path]: [0],
  Rig_Large: {
    [path]: [0, 0],
    Mannequin_Large_Arm_Left: {
      [path]: [0, 0, 0],
    },
    Mannequin_Large_Arm_Right: {
      [path]: [0, 0, 1],
    },
    Mannequin_Large_Body: {
      [path]: [0, 0, 2],
    },
    Mannequin_Large_Head: {
      [path]: [0, 0, 3],
    },
    Mannequin_Large_Leg_Left: {
      [path]: [0, 0, 4],
    },
    Mannequin_Large_Leg_Right: {
      [path]: [0, 0, 5],
    },
    root: {
      [path]: [0, 0, 6],
      hips: {
        [path]: [0, 0, 6, 0],
        upperlegl: {
          [path]: [0, 0, 6, 0, 0],
          lowerlegl: {
            [path]: [0, 0, 6, 0, 0, 0],
            footl: {
              [path]: [0, 0, 6, 0, 0, 0, 0],
              toesl: {
                [path]: [0, 0, 6, 0, 0, 0, 0, 0],
              },
            },
          },
        },
        upperlegr: {
          [path]: [0, 0, 6, 0, 1],
          lowerlegr: {
            [path]: [0, 0, 6, 0, 1, 0],
            footr: {
              [path]: [0, 0, 6, 0, 1, 0, 0],
              toesr: {
                [path]: [0, 0, 6, 0, 1, 0, 0, 0],
              },
            },
          },
        },
        spine: {
          [path]: [0, 0, 6, 0, 2],
          chest: {
            [path]: [0, 0, 6, 0, 2, 0],
            head: {
              [path]: [0, 0, 6, 0, 2, 0, 0],
            },
            upperarmr: {
              [path]: [0, 0, 6, 0, 2, 0, 1],
              lowerarmr: {
                [path]: [0, 0, 6, 0, 2, 0, 1, 0],
                wristr: {
                  [path]: [0, 0, 6, 0, 2, 0, 1, 0, 0],
                  handr: {
                    [path]: [0, 0, 6, 0, 2, 0, 1, 0, 0, 0],
                    handslotr: {
                      [path]: [0, 0, 6, 0, 2, 0, 1, 0, 0, 0, 0],
                    },
                  },
                },
              },
            },
            upperarml: {
              [path]: [0, 0, 6, 0, 2, 0, 2],
              lowerarml: {
                [path]: [0, 0, 6, 0, 2, 0, 2, 0],
                wristl: {
                  [path]: [0, 0, 6, 0, 2, 0, 2, 0, 0],
                  handl: {
                    [path]: [0, 0, 6, 0, 2, 0, 2, 0, 0, 0],
                    handslotl: {
                      [path]: [0, 0, 6, 0, 2, 0, 2, 0, 0, 0, 0],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export async function getNode(spec) {
  let node = { children: (await loadModel()).scenes };
  for (const idx of spec[path]) {
    node = node.children[idx];
  }

  return node;
}

let modelPromise;

function loadModel() {
  if (!modelPromise) {
    modelPromise = gltfLoader.loadAsync(gltfPath);
  }

  return modelPromise;
}
