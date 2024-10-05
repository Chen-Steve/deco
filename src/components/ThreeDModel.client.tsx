'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import Crosshair from './Crosshair'

interface ModelProps {
  objPath: string;
  mtlPath: string;
  position?: [number, number, number];
}

function CameraControls() {
  const { camera, gl } = useThree()
  const moveSpeed = useRef(0.1)
  const rotateSpeed = useRef(0.002)
  const keys = useRef<{ [key: string]: boolean }>({})
  const yawObject = useRef(new THREE.Object3D())

  useEffect(() => {
    const eyeHeight = 1.6 // Average human eye height in meters
    yawObject.current.position.set(0, eyeHeight, 0)
    camera.position.set(0, 0, 0) // Reset camera position
    yawObject.current.add(camera)

    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = true
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === gl.domElement) {
        yawObject.current.rotation.y -= event.movementX * rotateSpeed.current
        camera.rotation.x -= event.movementY * rotateSpeed.current
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x))
      }
    }

    const lockPointer = () => {
      gl.domElement.requestPointerLock()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousemove', handleMouseMove)
    gl.domElement.addEventListener('click', lockPointer)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousemove', handleMouseMove)
      gl.domElement.removeEventListener('click', lockPointer)
    }
  }, [camera, gl])

  useFrame(() => {
    const direction = new THREE.Vector3()

    if (keys.current['w']) direction.z -= 1
    if (keys.current['s']) direction.z += 1
    if (keys.current['a']) direction.x -= 1
    if (keys.current['d']) direction.x += 1

    if (direction.x !== 0 || direction.z !== 0) {
      direction.normalize()
      direction.applyEuler(new THREE.Euler(0, yawObject.current.rotation.y, 0))
      
      yawObject.current.position.addScaledVector(direction, moveSpeed.current)
    }

    console.log('Keys:', keys.current)
    console.log('Direction:', direction)
    console.log('Position:', yawObject.current.position.toArray())
  })

  return <primitive object={yawObject.current} />
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
        <CameraControls />
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
