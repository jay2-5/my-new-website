'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
 
export function SplineSceneBasic() {
  return (
    <Card 
      className="w-full h-[500px] md:h-[500px] bg-black/[0.96] relative overflow-hidden border-gray-700"
      role="region"
      aria-labelledby="hero-heading"
    >
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content - Improved text contrast */}
        <div className="flex-1 p-6 md:p-8 relative z-10 flex flex-col justify-center">
          <h1 
            id="hero-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-200"
          >
            AI Automation
          </h1>
          <p 
            className="mt-3 md:mt-4 text-gray-200 max-w-lg text-sm md:text-base"
            role="text"
          >
            Transform your business with cutting-edge AI solutions that operate seamlessly around the clock.
          </p>
        </div>

        {/* Right content - 3D Scene */}
        <div 
          className="flex-1 relative min-h-[250px] md:min-h-0"
          role="img"
          aria-label="Interactive 3D visualization of AI automation technology"
        >
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full absolute inset-0"
          />
        </div>
      </div>
    </Card>
  )
}