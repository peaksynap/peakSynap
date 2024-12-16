import {Canvas} from '@react-three/fiber'
import {Model} from './../public/uploads/Brain'
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import {Neuron} from './../public/uploads/Neuron'
export default function Home() {
  return (
    <>
      <Canvas camera={{ position: [5, 2, 10], fov:80}} style={{height: '50vh !important'}}>
        <ambientLight/>
        <OrbitControls/>
      <Suspense fallback="null">
        <Model/>
      </Suspense>
      </Canvas>
      <Canvas style={{height: '50vh !important', background: 'black'}}>
        <ambientLight/>
        <OrbitControls/>
      <Suspense fallback="null">
        <Neuron/>
      </Suspense>
      </Canvas>
    </>
  )
}
