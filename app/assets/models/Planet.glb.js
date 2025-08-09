import gltfLoader from "@todde.tv/gltf-type-toolkit/gltf-loader";
import gltfPath from "./Planet.glb";

const path = Symbol();

export const SceneScene = {
  [path]: [0],
  Planet: {
    [path]: [0, 0],
    Icosphere: {
      [path]: [0, 0, 0],
    },
    Icosphere_1: {
      [path]: [0, 0, 1],
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
