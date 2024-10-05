'use client'

import React, { useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import Crosshair from './Crosshair'
import CameraSystem from './CameraSystem'

interface ModelProps {
  objPath: string;
  mtlPath: string;
  position?: [number, number, number];
}

function PerformanceOptimizer() {
  const { gl } = useThree()
  React.useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }, [gl])
  return null
}

export function ThreeDModel({ models }: { models: ModelProps[] }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas 
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        style={{ width: '100%', height: '100%', background: '#f0f0f0' }}
        shadows
      >
        <PerformanceOptimizer />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        {models.map((model, index) => (
          <Model key={index} {...model} />
        ))}
        <CameraSystem />
        <gridHelper args={[100, 100]} position={[0, 0.01, 0]} />
        <axesHelper args={[5]} />
      </Canvas>
      <Crosshair />
    </div>
  )
}

function Model({ objPath, mtlPath, position = [0, 0, 0] }: ModelProps) {
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const mtlLoader = new MTLLoader()
    mtlLoader.load(
      mtlPath,
      (materials) => {
        materials.preload()
        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials)
        objLoader.load(
          objPath,
          (object) => {
            object.position.set(...position)
            setModel(object)
          },
          undefined,
          (error) => {
            if (error instanceof Error) {
              setError('Error loading model: ' + error.message)
            } else {
              setError('Unknown error occurred while loading model')
            }
          }
        )
      },
      undefined,
      (error) => {
        if (error instanceof Error) {
          setError('Error loading materials: ' + error.message)
        } else {
          setError('Unknown error occurred while loading materials')
        }
      }
    )
  }, [objPath, mtlPath, position])

  if (error) {
    console.error(error)
    return <primitive object={new THREE.Object3D()} />
  }

  return model ? (
    <primitive 
      object={model} 
      position={position}
      castShadow
      receiveShadow
    />
  ) : null
}
