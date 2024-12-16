import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    brain_lambert1_0: THREE.Mesh;
  };
  materials: {
    Glass: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements['group']) {
  const groupRef = useRef<THREE.Group>(null); // Referencia al grupo
  const { nodes, materials } = useGLTF('/Brain.glb') as GLTFResult;

  // Hook para animar la rotación
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01; // Rotación continua en el eje Y
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.brain_lambert1_0.geometry}
        material={materials.Glass}
        position={[-0.212, -1.09, 1.118]}
      />
    </group>
  );
}

useGLTF.preload('/Brain.glb');
