import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { Group, DefaultLoadingManager } from 'three'
import { useMemo } from 'react'

const modelCache: { [key: string]: Group } = {}

export function useModelLoader(objPath: string, mtlPath: string) {
  const obj = useLoader(
    OBJLoader,
    objPath,
    (loader) => {
      new MTLLoader(DefaultLoadingManager).loadAsync(mtlPath).then((materials) => {
        materials.preload()
        loader.setMaterials(materials)
      })
    }
  ) as Group

  return useMemo(() => {
    if (modelCache[objPath]) {
      return modelCache[objPath]
    }
    modelCache[objPath] = obj
    return obj
  }, [objPath, obj])
}