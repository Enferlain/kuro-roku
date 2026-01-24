// Background - Atmospheric layered background effect
// Uses semantic tokens from design-system.css

export function Background() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Layer 1: Base Gradient - uses design tokens */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-kuro-700)_0%,var(--color-kuro-800)_50%,var(--color-kuro-900)_100%)]" />

      {/* Layer 2: Animated Blobs - using primary color */}
      <div 
        className="absolute top-[-10%] left-[30%] w-[1000px] h-[1000px] bg-primary/15 rounded-full blur-[150px] animate-pulse opacity-30" 
      />
      <div 
        className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse opacity-20" 
        style={{ animationDelay: "2s" }} 
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[900px] h-[900px] bg-azure-600/10 rounded-full blur-[130px] animate-pulse opacity-20" 
        style={{ animationDelay: "4s" }} 
      />

      {/* Layer 3: Grid Overlay - subtle structural element */}
      <div
        className="absolute inset-0 bg-[linear-gradient(var(--border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--border-subtle)_1px,transparent_1px)] opacity-20"
        style={{ backgroundSize: "40px 40px" }}
      />

      {/* Layer 4: Noise Texture - adds grain */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
