import React from 'react'

export function PrismaticBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-400/5 blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-cyan-400/5 blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-cyan-300/5 blur-3xl" />

      {/* SVG Definitions */}
      <svg className="sr-only">
        <defs>
          <linearGradient id="prism-grad-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="prism-grad-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="prism-grad-3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.01" />
          </linearGradient>
        </defs>
      </svg>

      {/* Prism Shape 1: Top Left */}
      <div className="absolute -top-10 -left-10 w-96 h-96 rotate-[15deg] opacity-60 blur-[16px]">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Facets */}
          <polygon points="50,10 15,80 50,55" fill="url(#prism-grad-1)" />
          <polygon points="50,10 85,80 50,55" fill="url(#prism-grad-2)" />
          <polygon points="15,80 85,80 50,55" fill="url(#prism-grad-3)" />
          {/* Inner Facet Lines */}
          <line x1="50" y1="55" x2="50" y2="10" stroke="#7C3AED" strokeWidth="0.3" strokeOpacity="0.15" />
          <line x1="50" y1="55" x2="15" y2="80" stroke="#7C3AED" strokeWidth="0.3" strokeOpacity="0.15" />
          <line x1="50" y1="55" x2="85" y2="80" stroke="#22D3EE" strokeWidth="0.3" strokeOpacity="0.15" />
          {/* Outer Boundary */}
          <polygon points="50,10 15,80 85,80" stroke="#7C3AED" strokeWidth="0.4" strokeOpacity="0.1" />
        </svg>
      </div>

      {/* Prism Shape 2: Middle Right */}
      <div className="absolute top-[25%] -right-16 w-80 h-80 rotate-[-35deg] opacity-50 blur-[20px]">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 20,80 50,58" fill="url(#prism-grad-2)" />
          <polygon points="50,10 80,80 50,58" fill="url(#prism-grad-1)" />
          <polygon points="20,80 80,80 50,58" fill="url(#prism-grad-3)" />
          <line x1="50" y1="58" x2="50" y2="10" stroke="#22D3EE" strokeWidth="0.3" strokeOpacity="0.15" />
          <line x1="50" y1="58" x2="20" y2="80" stroke="#22D3EE" strokeWidth="0.3" strokeOpacity="0.15" />
          <line x1="50" y1="58" x2="80" y2="80" stroke="#7C3AED" strokeWidth="0.3" strokeOpacity="0.15" />
          <polygon points="50,10 20,80 80,80" stroke="#22D3EE" strokeWidth="0.4" strokeOpacity="0.1" />
        </svg>
      </div>

      {/* Prism Shape 3: Bottom Left */}
      <div className="absolute -bottom-16 left-[20%] w-64 h-64 rotate-[45deg] opacity-40 blur-[12px]">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,15 25,75 50,52" fill="url(#prism-grad-1)" />
          <polygon points="50,15 75,75 50,52" fill="url(#prism-grad-3)" />
          <polygon points="25,75 75,75 50,52" fill="url(#prism-grad-2)" />
          <line x1="50" y1="52" x2="50" y2="15" stroke="#7C3AED" strokeWidth="0.3" strokeOpacity="0.1" />
          <line x1="50" y1="52" x2="25" y2="75" stroke="#7C3AED" strokeWidth="0.3" strokeOpacity="0.1" />
          <line x1="50" y1="52" x2="75" y2="75" stroke="#22D3EE" strokeWidth="0.3" strokeOpacity="0.1" />
          <polygon points="50,15 25,75 75,75" stroke="#22D3EE" strokeWidth="0.4" strokeOpacity="0.08" />
        </svg>
      </div>
    </div>
  )
}

export default PrismaticBackground
