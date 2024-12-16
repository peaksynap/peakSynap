import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Sphere: THREE.Mesh
  }
  materials: {
    ['Material.001']: THREE.MeshStandardMaterial
  }
}

export function Neuron(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/Neuron.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sphere.geometry}
        material={materials['Material.001']}
        position={[2.936, -1.004, -0.536]}
        scale={0.131}
      />
    </group>
  )
}

useGLTF.preload('/Neuron.glb')