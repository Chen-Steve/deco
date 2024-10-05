import dynamic from 'next/dynamic'
import React, { Suspense } from 'react';

const ThreeDModelWithNoSSR = dynamic(
  () => import('../components/ThreeDModel.client').then((mod) => mod.ThreeDModel),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="w-full h-screen">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading OBJ models...</div>}>
        <ThreeDModelWithNoSSR 
          models={[
            {
              objPath: "/Separated/Microwave.obj",
              mtlPath: "/Separated/Microwave.mtl",
              position: [-2, 0, 0]
            },
            {
              objPath: "/Separated/Mailbox.obj",
              mtlPath: "/Separated/Mailbox.mtl",
              position: [2, 0, 0]
            }
          ]}
        />
      </Suspense>
    </div>
  );
}