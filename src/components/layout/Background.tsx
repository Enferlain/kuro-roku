// Background - Atmospheric layered background effect
// Uses semantic tokens from design-system.css

export function Background() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Layer 1: Clean Neutral Background - uses design tokens */}
      <div className="absolute inset-0 bg-background" />

      {/* Layer 2: Static Blobs - REMOVED (pixelated) */}
      {/* Removed pixelated blob elements for cleaner appearance */}

      {/* Layer 3: Grid Overlay - subtle structural element (COMMENTED OUT) */}
      {/* Kept for future theme support implementation */}
      {/* 
      <div
        className="absolute inset-0 bg-[linear-gradient(var(--border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--border-subtle)_1px,transparent_1px)] opacity-20"
        style={{ backgroundSize: "40px 40px" }}
      />
      */}

      {/* Layer 4: Checkerboard Pattern - COMMENTED OUT for future use */}
      {/* Uncomment below to enable checkerboard pattern background */}
      {/* 
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-conic-gradient(var(--color-kuro-700) 0% 25%, var(--color-kuro-800) 0% 50%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px"
        }}
      />
      */}

      {/* Layer 5: Noise Texture - COMMENTED OUT (too noisy) */}
      {/* Uncomment below to enable noise texture */}
      {/* 
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      */}
    </div>
  );
}
