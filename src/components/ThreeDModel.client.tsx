'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useModelLoader } from '../hooks/useModelLoader'
import Crosshair from './Crosshair'
import CameraSystem from './CameraSystem'

interface ModelProps {
  objPath: string;
  mtlPath: string;
  position?: [number, number, number];
}

function Model({ objPath, mtlPath, position = [0, 0, 0] }: ModelProps) {
  const model = useModelLoader(objPath, mtlPath)

  return (
    <primitive 
      object={model} 
      position={position}
      castShadow
      receiveShadow
    />
  )
}

function LoadingPlaceholder() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  )
}

export function ThreeDModel({ models }: { models: ModelProps[] }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas 
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        style={{ width: '100%', height: '100%', background: '#f0f0f0' }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={<LoadingPlaceholder />}>
          {models.map((model, index) => (
            <Model key={index} {...model} />
          ))}
        </Suspense>
        <CameraSystem />
        <gridHelper args={[100, 100]} position={[0, 0.01, 0]} />
        <axesHelper args={[5]} />
      </Canvas>
      <Crosshair />
    </div>
  )
}
