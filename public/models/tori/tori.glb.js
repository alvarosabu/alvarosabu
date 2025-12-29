import gltfLoader from "@todde.tv/gltf-type-toolkit/gltf-loader";
import gltfPath from "./tori.glb";

const path = Symbol();

export const Sketchfab_SceneScene = {
  [path]: [0],
  Sketchfab_model: {
    [path]: [0, 0],
    cab68025621d449ca96e0e4fba5325d6fbx: {
      [path]: [0, 0, 0],
      Root_Node: {
        [path]: [0, 0, 0, 0],
        sweep15: {
          [path]: [0, 0, 0, 0, 0],
          poly_Surface58: {
            [path]: [0, 0, 0, 0, 0, 0],
            poly_Surface58_lambert3_0: {
              [path]: [0, 0, 0, 0, 0, 0, 0],
            },
          },
        },
        poly_Surface49: {
          [path]: [0, 0, 0, 0, 1],
          poly_Surface49_ai_Standard_Surface1_0: {
            [path]: [0, 0, 0, 0, 1, 0],
          },
        },
        poly_Surface68: {
          [path]: [0, 0, 0, 0, 2],
          poly_Surface68_ai_Standard_Surface2_0: {
            [path]: [0, 0, 0, 0, 2, 0],
          },
        },
        poly_Surface81: {
          [path]: [0, 0, 0, 0, 3],
          poly_Surface81_ai_Standard_Surface4_0: {
            [path]: [0, 0, 0, 0, 3, 0],
          },
        },
        poly_Surface55: {
          [path]: [0, 0, 0, 0, 4],
          poly_Surface55_lambert3_0: {
            [path]: [0, 0, 0, 0, 4, 0],
          },
        },
        poly_Surface76: {
          [path]: [0, 0, 0, 0, 5],
          poly_Surface76_ai_Standard_Surface3_0: {
            [path]: [0, 0, 0, 0, 5, 0],
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
