'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div 
      className={`${className} overflow-hidden`}
      role="img"
      aria-label="3D interactive scene"
    >
      <Suspense 
        fallback={
          <div 
            className="w-full h-full flex items-center justify-center"
            role="status"
            aria-label="Loading 3D scene"
          >
            <div 
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            ></div>
            <span className="sr-only">Loading 3D visualization...</span>
          </div>
        }
      >
        <Spline
          scene={scene}
          style={{
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%'
          }}
        />
      </Suspense>
    </div>
  )
}