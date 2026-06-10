import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { BRAND } from "../brand";

const CX = 540;
const CY = 960;
const CORE_R = 48;

// Phase timing (logical frames) — 45 total (1.5s at 30fps)
const P1_END = 15;
const P2_START = 13;
const P2_END = 30;
const P3_START = 28;

const ICONS = [
  { id: "leads",    x: 140,  y: 290,  label: "לידים",    color: BRAND.blueL },
  { id: "popup",    x: 940,  y: 320,  label: "פולאפים",  color: BRAND.pink  },
  { id: "email",    x: 82,   y: 720,  label: "מיילים",   color: BRAND.blueL },
  { id: "reminder", x: 998,  y: 680,  label: "תזכורות",  color: BRAND.blueL },
  { id: "chat",     x: 165,  y: 1440, label: "וואטסאפ",  color: BRAND.pink  },
  { id: "crm",      x: 918,  y: 1420, label: "CRM",      color: BRAND.pink  },
] as const;

type IconId = typeof ICONS[number]["id"];

function IconShape({ id, color }: { id: IconId; color: string }) {
  switch (id) {
    case "leads":
      return <>
        <circle cx="0" cy="-16" r="12" fill={color} />
        <path d="M -20 8 Q -20 28 0 28 Q 20 28 20 8 Q 20 -4 0 -4 Q -20 -4 -20 8 Z" fill={color} />
      </>;
    case "popup":
      return <>
        <path d="M 0,-26 Q -20,-26 -20,-6 L -20,14 L 20,14 L 20,-6 Q 20,-26 0,-26 Z" fill={color} />
        <circle cx="0" cy="20" r="6" fill={color} />
        <rect x="-6" y="-30" width="12" height="8" rx="4" fill={color} />
      </>;
    case "email":
      return <>
        <rect x="-24" y="-16" width="48" height="32" rx="4" fill="none" stroke={color} strokeWidth="2.5" />
        <polyline points="-24,-16 0,8 24,-16" fill="none" stroke={color} strokeWidth="2.5" />
      </>;
    case "reminder":
      return <>
        <circle cx="0" cy="0" r="24" fill="none" stroke={color} strokeWidth="2.5" />
        <line x1="0" y1="0" x2="0" y2="-14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0" y1="0" x2="10" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>;
    case "chat":
      return <path d="M -22,-18 Q -22,-26 0,-26 Q 22,-26 22,-18 L 22,8 Q 22,16 8,16 L -10,16 L -18,26 L -18,16 Q -22,16 -22,8 Z" fill={color} />;
    case "crm":
      return <>
        <rect x="-24" y="-24" width="20" height="20" rx="3" fill={color} />
        <rect x="-24" y="4" width="20" height="20" rx="3" fill={color} />
        <rect x="4" y="-24" width="20" height="20" rx="3" fill={color} />
        <rect x="4" y="4" width="20" height="20" rx="3" fill={color} />
      </>;
  }
}

function lineDist(icon: typeof ICONS[number]) {
  return Math.hypot(icon.x - CX, icon.y - CY);
}

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  angle: i * 36 + 14,
  dist: 220 + (i % 3) * 65,
  delay: i * 2,
}));

interface HookAnimationProps {
  f: number;
}

export const HookAnimation: React.FC<HookAnimationProps> = ({ f }) => {
  const { fps } = useVideoConfig();

  // Core
  const coreSpring = spring({ frame: f - P2_START, fps, config: { damping: 22, stiffness: 160, mass: 1 } });
  const coreR = CORE_R * coreSpring;
  const corePulse = f >= 27 ? 1 + Math.sin((f - 27) * 0.38) * 0.1 : 1;

  // Final glow ring
  const glowRingR = interpolate(f, [41, 46], [0, 920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowRingOp = interpolate(f, [41, 43, 46], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", transform: "scale(0.5) translateY(1170px)", transformOrigin: "center center" }}
    >
      {/* ── Phase 3: connection lines (behind icons) ── */}
      {ICONS.map((icon, i) => {
        if (f < P3_START) return null;
        const dist = lineDist(icon);
        const lineStart = P3_START + i * 2;
        const prog = spring({ frame: f - lineStart, fps, config: { damping: 30, stiffness: 140, mass: 0.8 } });
        const angle = Math.atan2(icon.y - CY, icon.x - CX);
        const ex = CX + Math.cos(angle) * (CORE_R + (dist - CORE_R) * Math.min(prog, 1));
        const ey = CY + Math.sin(angle) * (CORE_R + (dist - CORE_R) * Math.min(prog, 1));
        return (
          <g key={`line-${icon.id}`}>
            {/* Glow copy */}
            <line x1={CX} y1={CY} x2={ex} y2={ey} stroke={icon.color} strokeWidth={5} opacity={0.18 * Math.min(prog, 1)} />
            {/* Core line */}
            <line x1={CX} y1={CY} x2={ex} y2={ey} stroke={icon.color} strokeWidth={1.8} opacity={0.72 * Math.min(prog, 1)} />
          </g>
        );
      })}

      {/* ── Icons ── */}
      {ICONS.map((icon, i) => {
        const appear = spring({ frame: f - i * 2, fps, config: { damping: 20, stiffness: 220, mass: 0.7 } });

        // Phase 1: gray flicker
        const grayBase = interpolate(f, [i * 2, i * 2 + 5], [0, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const grayOp = Math.max(0, grayBase + Math.sin(f * 0.38 + i * 1.3) * 0.07);

        // Phase 3: light up when line arrives
        const lineArrival = P3_START + i * 2 + 7;
        const litOp = interpolate(f, [lineArrival, lineArrival + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        const scale = 0.5 + appear * 0.5;

        return (
          <g key={icon.id} transform={`translate(${icon.x}, ${icon.y}) scale(${scale})`}>
            {/* Glow ring when lit */}
            {litOp > 0 && <circle r="52" fill={icon.color} opacity={0.14 * litOp} />}
            {/* Gray state */}
            <g opacity={(1 - litOp) * grayOp}>
              <IconShape id={icon.id} color="#6b7280" />
            </g>
            {/* Lit state */}
            <g opacity={litOp}>
              <IconShape id={icon.id} color={icon.color} />
            </g>
            {/* Label */}
            <text
              y="46"
              textAnchor="middle"
              fontSize="27"
              fontFamily="Heebo, sans-serif"
              fontWeight="600"
              fill={litOp > 0.5 ? icon.color : "#555"}
              opacity={Math.max(grayOp, litOp) * 0.85}
            >
              {icon.label}
            </text>
          </g>
        );
      })}

      {/* ── Particles (phase 2) ── */}
      {f >= P2_START && PARTICLES.map((p, i) => {
        const prog = interpolate(f, [P2_START + Math.floor(p.delay / 2), P2_END - 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const px = CX + Math.cos((p.angle * Math.PI) / 180) * p.dist * (1 - prog);
        const py = CY + Math.sin((p.angle * Math.PI) / 180) * p.dist * (1 - prog);
        const pOp = interpolate(prog, [0, 0.15, 0.85, 1], [0, 0.9, 0.75, 0]);
        return <circle key={i} cx={px} cy={py} r={5} fill={BRAND.pink} opacity={pOp} />;
      })}

      {/* ── Core (phase 2+) ── */}
      {f >= P2_START && (
        <g transform={`translate(${CX}, ${CY}) scale(${corePulse})`}>
          <circle r={coreR + 44} fill={BRAND.pink} opacity={0.055 * coreSpring} />
          <circle r={coreR + 22} fill={BRAND.pink} opacity={0.10 * coreSpring} />
          <circle r={coreR} fill={BRAND.bgF} stroke={BRAND.pink} strokeWidth={2.5} opacity={coreSpring} />
          {/* Inner lines form sequentially */}
          {[0, 60, 120].map((deg, idx) => {
            const la = spring({ frame: f - (P2_START + 4 + idx * 3), fps, config: { damping: 18, stiffness: 200, mass: 0.7 } });
            const rad = (deg * Math.PI) / 180;
            const len = (CORE_R - 10) * la;
            return (
              <line
                key={deg}
                x1={-Math.cos(rad) * len} y1={-Math.sin(rad) * len}
                x2={Math.cos(rad) * len} y2={Math.sin(rad) * len}
                stroke={BRAND.pink} strokeWidth={1.8} opacity={0.72 * la}
              />
            );
          })}
          <circle r={8 * coreSpring} fill={BRAND.pink} />
        </g>
      )}

      {/* ── Final glow ring ── */}
      {glowRingOp > 0 && (
        <circle cx={CX} cy={CY} r={glowRingR} fill="none" stroke={BRAND.pink} strokeWidth={5} opacity={glowRingOp} />
      )}
    </svg>
  );
};
