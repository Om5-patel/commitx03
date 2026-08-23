"use client";

export default function BackgroundMesh() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* 40px Grid Layer */}
      <div className="absolute inset-0 bg-grid-mesh opacity-60" />

      {/* Drifting Emerald Orb */}
      <div
        className="mesh-orb-emerald absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] opacity-15"
        style={{
          background: "radial-gradient(circle, #10B981 0%, rgba(16,185,129,0) 70%)",
        }}
      />

      {/* Drifting Cyan Orb */}
      <div
        className="mesh-orb-cyan absolute top-1/3 -right-48 w-[700px] h-[700px] rounded-full blur-[160px] opacity-12"
        style={{
          background: "radial-gradient(circle, #06B6D4 0%, rgba(6,182,212,0) 70%)",
        }}
      />

      {/* Ambient Amber Core Orb */}
      <div
        className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-8"
        style={{
          background: "radial-gradient(circle, #F59E0B 0%, rgba(245,158,11,0) 70%)",
        }}
      />

      {/* Subtle Vignette Edge */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,13,16,0.7)_100%)]" />
    </div>
  );
}
