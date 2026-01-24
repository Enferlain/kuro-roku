import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Layer 1: Base Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />

      {/* Layer 2: Animated Blobs */}
      <div className="absolute top-[-10%] left-[30%] w-[1000px] h-[1000px] bg-accent/20 rounded-full blur-[150px] animate-blob mix-blend-screen opacity-20" />
      <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen opacity-15" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[900px] h-[900px] bg-blue-600/10 rounded-full blur-[130px] animate-blob animation-delay-4000 mix-blend-screen opacity-15" />

      {/* Layer 3: Grid Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" 
        style={{ backgroundSize: '40px 40px' }}
      />
      
      {/* Layer 4: Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
      }} />
    </div>
  );
};