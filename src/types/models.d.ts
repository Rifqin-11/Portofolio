import { GLTF } from "three-stdlib";
import * as THREE from "three";

export type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

