import React, { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import MovementSystem from './MovementSystem'

function CameraSystem() {
  const { camera, gl } = useThree()
  const rotateSpeed = useRef(0.002)
  const yawObject = useRef(new THREE.Object3D())

  useEffect(() => {
    const eyeHeight = 1.6 // Average human eye height in meters
    yawObject.current.position.set(0, eyeHeight, 0)
    camera.position.set(0, 0, 0) // Reset camera position
    yawObject.current.add(camera)

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

    document.addEventListener('mousemove', handleMouseMove)
    gl.domElement.addEventListener('click', lockPointer)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      gl.domElement.removeEventListener('click', lockPointer)
    }
  }, [camera, gl])

  return (
    <>
      <primitive object={yawObject.current} />
      <MovementSystem yawObject={yawObject.current} />
    </>
  )
}

export default CameraSystem