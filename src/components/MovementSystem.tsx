import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MovementSystemProps {
  yawObject: THREE.Object3D;
}

function MovementSystem({ yawObject }: MovementSystemProps) {
  const moveSpeed = useRef(0.1)
  const jumpForce = useRef(0.15)
  const gravity = useRef(0.006)
  const keys = useRef<{ [key: string]: boolean }>({})
  const velocity = useRef(new THREE.Vector3())
  const isJumping = useRef(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = true
      if (event.code === 'Space' && !isJumping.current) {
        velocity.current.y = jumpForce.current
        isJumping.current = true
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    const direction = new THREE.Vector3()

    if (keys.current['w']) direction.z -= 1
    if (keys.current['s']) direction.z += 1
    if (keys.current['a']) direction.x -= 1
    if (keys.current['d']) direction.x += 1

    if (direction.x !== 0 || direction.z !== 0) {
      direction.normalize()
      direction.applyEuler(new THREE.Euler(0, yawObject.rotation.y, 0))
      
      yawObject.position.addScaledVector(direction, moveSpeed.current)
    }

    // Apply gravity
    velocity.current.y -= gravity.current
    yawObject.position.y += velocity.current.y

    // Check if we're on the ground
    if (yawObject.position.y < 1.6) {
      velocity.current.y = 0
      yawObject.position.y = 1.6
      isJumping.current = false
    }

    console.log('Keys:', keys.current)
    console.log('Position:', yawObject.position.toArray())
    console.log('Velocity:', velocity.current.toArray())
  })

  return null
}

export default MovementSystem