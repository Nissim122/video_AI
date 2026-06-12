import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { VideoBase } from "../components/VideoBase";
import { LogoWatermark } from "../components/LogoWatermark";
import { ChapterMarker } from "../components/ChapterMarker";
import { PictureInPicture } from "../components/PictureInPicture";
import { LowerThird } from "../components/LowerThird";
import { TextPop } from "../components/TextPop";
import { Callout } from "../components/Callout";
import { OutroScreen } from "../components/OutroScreen";
import { VignetteGrade } from "../components/VignetteGrade";
import { FadeTransition } from "../components/FadeTransition";
import { KineticText } from "../components/KineticText";
import { BRollOverlay } from "../components/BRollOverlay";
import { ReactionBubble } from "../components/ReactionBubble";
import { PunchTransition } from "../components/PunchTransition";
import { BulletList } from "../components/BulletList";
import { StatCard } from "../components/StatCard";
import { HighlightBox } from "../components/HighlightBox";
import { CTAButton } from "../components/CTAButton";
import { SocialHandle } from "../components/SocialHandle";
// ── New components ────────────────────────────────────────────────────────────
import { TypewriterText } from "../components/TypewriterText";
import { MorphText } from "../components/MorphText";
import { TextScramble } from "../components/TextScramble";
import { GradientText } from "../components/GradientText";
import { WordHighlight } from "../components/WordHighlight";
import { ChatBubble } from "../components/ChatBubble";
import { PhoneNotification } from "../components/PhoneNotification";
import { ConfirmCheck } from "../components/ConfirmCheck";
import { ProgressRing } from "../components/ProgressRing";
import { AutomationFlow } from "../components/AutomationFlow";
import { CameraShake } from "../components/CameraShake";
import { SpotlightReveal } from "../components/SpotlightReveal";
import { ZoomBurst } from "../components/ZoomBurst";
import { ParticleField } from "../components/ParticleField";
import { GlowPulse } from "../components/GlowPulse";
import { DrawPath } from "../components/DrawPath";
import { CountdownTimer } from "../components/CountdownTimer";
import { FloatingEmoji } from "../components/FloatingEmoji";
import { TrackedOverlay } from "../components/TrackedOverlay";
import { SmartZoom } from "../components/SmartZoom";
import { WhipPan } from "../components/WhipPan";
import { ContinuousDrift } from "../components/ContinuousDrift";
import { MotionBlur } from "../components/MotionBlur";
import { DepthOfField } from "../components/DepthOfField";
import { LensFlare } from "../components/LensFlare";
import { ChromaticAberration } from "../components/ChromaticAberration";
import { TextLineReveal } from "../components/TextLineReveal";
import { AnamorphicStreak } from "../components/AnamorphicStreak";
import { PersonBurst } from "../components/PersonBurst";
import { AEText } from "../components/AEText";
import {
  VIDEO_CONFIG, PIPS, CHAPTERS, LOGO,
  LOWER_THIRDS, TEXT_POPS, CALLOUTS, OUTRO, GRADE,
  FADES, BULLET_LISTS, STAT_CARDS, HIGHLIGHTS, CTA_BUTTONS, SOCIAL_HANDLES,
  KINETIC_TEXTS, BROLLS, REACTIONS, PUNCHES,
  // New config exports
  TYPEWRITERS, MORPHS, SCRAMBLES, GRADIENT_TEXTS, WORD_HIGHLIGHTS,
  CHATS, NOTIFICATIONS, CHECKS, PROGRESS_RINGS, FLOWS,
  SHAKES, SPOTLIGHTS, ZOOM_BURSTS, PARTICLE_FIELD, GLOW_PULSES,
  DRAW_PATHS, COUNTDOWNS, FLOATING_EMOJIS,
  SMART_ZOOMS, WHIP_PANS, DRIFT, TRACKED_OVERLAYS,
  // AE components
  MOTION_BLURS, DOF_EVENTS, LENS_FLARES, CA_CONFIG,
  TEXT_LINE_REVEALS, ANAMORPHIC_STREAKS,
  PERSON_BURSTS,
  AE_TEXTS,
} from "../edit-config";

const ICON_SIZE = 120;
const LAUNCH_FRAME = 75;

const ICONS = [
  { symbol: "✆", bg1: "#25D366", bg2: "#128C7E", glow: "#25D366", label: "WhatsApp", x: 118,  y: 320, stagger: 0  },
  { symbol: "✈", bg1: "#2CA5E0", bg2: "#1A7FBD", glow: "#2CA5E0", label: "Telegram",  x: 290,  y: 228, stagger: 4  },
  { symbol: "⚙", bg1: "#9B4DFF", bg2: "#6B25E0", glow: "#9B4DFF", label: "Make",      x: 540,  y: 165, stagger: 16 },
  { symbol: "▣", bg1: "#FF6B35", bg2: "#CC4400", glow: "#FF6B35", label: "Monday",    x: 790,  y: 228, stagger: 12 },
  { symbol: "✉", bg1: "#EA4335", bg2: "#C5221F", glow: "#EA4335", label: "Gmail",     x: 962,  y: 320, stagger: 8  },
] as const;

const CONNECTIONS: [number, number][] = [
  [2, 0], [2, 1], [2, 3], [2, 4],
  [0, 1], [3, 4],
];

const iconCenterY = (i: number) => ICONS[i].y + ICON_SIZE / 2;

const NetworkLines: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => (
  <svg style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1920 }}>
    <defs>
      {CONNECTIONS.map((_, ci) => (
        <filter key={ci} id={`dot-glow-${ci}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ))}
    </defs>
    {CONNECTIONS.map(([a, b], ci) => {
      const ax = ICONS[a].x, ay = iconCenterY(a);
      const bx = ICONS[b].x, by = iconCenterY(b);
      const color = ICONS[a].glow;
      const speed = 0.55 + ci * 0.07;
      const t = ((frame / 30) * speed + ci * 0.28) % 1;
      const dotX = ax + (bx - ax) * t;
      const dotY = ay + (by - ay) * t;
      return (
        <g key={ci} opacity={opacity}>
          <line x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={1.5} strokeOpacity={0.2} />
          <line x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={6}  strokeOpacity={0.06} />
          <circle cx={dotX} cy={dotY} r={10} fill={color} opacity={0.18} />
          <circle cx={dotX} cy={dotY} r={5}  fill={color} opacity={0.95} filter={`url(#dot-glow-${ci})`} />
        </g>
      );
    })}
  </svg>
);

const AppIcon: React.FC<{ icon: (typeof ICONS)[number]; index: number; frame: number; fps: number }> = ({
  icon, index, frame, fps,
}) => {
  const delay = LAUNCH_FRAME + icon.stagger;
  const localFrame = Math.max(0, frame - delay);
  const progress = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 150, mass: 0.8 } });
  const y = icon.y + (1700 - icon.y) * (1 - progress);
  const scale = interpolate(progress, [0, 0.4, 1], [0, 1.2, 1], { extrapolateRight: "clamp" });
  const settled = localFrame > 45;
  const floatY = settled ? Math.sin(((frame + index * 23) / fps) * Math.PI * 1.25) * 10 : 0;
  const floatRotate = settled ? Math.sin(((frame + index * 17) / fps) * Math.PI * 0.9) * 1.8 : 0;
  return (
    <div style={{
      position: "absolute",
      left: icon.x - ICON_SIZE / 2,
      top: y + floatY,
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: 26,
      background: `linear-gradient(145deg, ${icon.bg1}, ${icon.bg2})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 50,
      color: "#fff",
      transform: `scale(${scale}) rotate(${floatRotate}deg)`,
      transformOrigin: "center bottom",
      boxShadow: [
        `0 0 0 2px rgba(255,255,255,0.15)`,
        `0 0 22px ${icon.glow}88`,
        `0 0 55px ${icon.glow}44`,
        `0 10px 30px rgba(0,0,0,0.55)`,
      ].join(", "),
    }}>
      {icon.symbol}
    </div>
  );
};

export const VideoOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const allLandedAt = LAUNCH_FRAME + Math.max(...ICONS.map((ic) => ic.stagger)) + 40;
  const networkOpacity = interpolate(frame, [allLandedAt, allLandedAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const topGradient =
    "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, transparent 55%)";

  return (
    <AbsoluteFill>
      {/* ── AE stack: ChromaticAberration > MotionBlur > DepthOfField > Camera stack ── */}
      <ChromaticAberration
        baseIntensity={CA_CONFIG.enabled ? CA_CONFIG.baseIntensity : 0}
        events={CA_CONFIG.enabled ? CA_CONFIG.events : []}
      >
      <MotionBlur events={MOTION_BLURS}>
      <DepthOfField events={DOF_EVENTS}>
      {/* ── Camera stack: ZoomBurst > SmartZoom > ContinuousDrift > WhipPan > CameraShake ── */}
      <ZoomBurst bursts={ZOOM_BURSTS}>
        <SmartZoom events={SMART_ZOOMS}>
          <ContinuousDrift
            enabled={DRIFT.enabled}
            mode={DRIFT.mode}
            panAmount={DRIFT.panAmount}
            zoomAmount={DRIFT.zoomAmount}
            speed={DRIFT.speed}
          >
            <WhipPan whips={WHIP_PANS}>
              <CameraShake shakes={SHAKES}>

                {/* Base video */}
                <VideoBase src={VIDEO_CONFIG.src} />

                {/* Particle field — background layer */}
                {PARTICLE_FIELD.show && (
                  <ParticleField
                    count={PARTICLE_FIELD.count}
                    color={PARTICLE_FIELD.color}
                    dotSize={PARTICLE_FIELD.dotSize}
                    speed={PARTICLE_FIELD.speed}
                    connected={PARTICLE_FIELD.connected}
                    opacity={PARTICLE_FIELD.opacity}
                    enterFrame={PARTICLE_FIELD.enterFrame}
                  />
                )}

                {/* Glow pulses — background atmosphere */}
                {GLOW_PULSES.map((gp, i) => (
                  <GlowPulse key={i} {...gp} />
                ))}

                {/* Top vignette */}
                <AbsoluteFill style={{ background: topGradient, pointerEvents: "none" }} />

                {/* Network connections */}
                <AbsoluteFill style={{ pointerEvents: "none" }}>
                  <NetworkLines frame={frame} opacity={networkOpacity} />
                </AbsoluteFill>

                {/* App icons */}
                {ICONS.map((icon, i) => (
                  <AppIcon key={i} icon={icon} index={i} frame={frame} fps={fps} />
                ))}

                {/* B-Roll overlays */}
                {BROLLS.map((br, i) => (
                  <BRollOverlay key={i} {...br} />
                ))}

                {/* Vignette + color grade */}
                {GRADE.show && (
                  <VignetteGrade
                    vignetteStrength={GRADE.vignetteStrength}
                    tone={GRADE.tone}
                    brightness={GRADE.brightness}
                    contrast={GRADE.contrast}
                  />
                )}

                {/* Spotlight reveals — dims surroundings */}
                {SPOTLIGHTS.map((sp, i) => (
                  <SpotlightReveal key={i} {...sp} />
                ))}

                {/* Draw paths — SVG arrows */}
                {DRAW_PATHS.map((dp, i) => (
                  <DrawPath key={i} {...dp} />
                ))}

                {/* PiP overlays */}
                {PIPS.map((pip, i) => (
                  <PictureInPicture key={i} {...pip} />
                ))}

                {/* Automation flow diagrams */}
                {FLOWS.map((fl, i) => (
                  <AutomationFlow key={i} {...fl} />
                ))}

                {/* Callouts */}
                {CALLOUTS.map((c, i) => (
                  <Callout key={i} {...c} />
                ))}

                {/* Tracked overlays — spatial tracking via MediaPipe */}
                {TRACKED_OVERLAYS.map((to, i) => (
                  <TrackedOverlay
                    key={i}
                    data={to.data}
                    enterFrame={to.enterFrame}
                    exitFrame={to.exitFrame}
                    offsetX={to.offsetX}
                    offsetY={to.offsetY}
                  >
                    {({ x, y }) =>
                      to.type === "callout" ? (
                        <Callout
                          arrowX={x}
                          arrowY={y}
                          text={to.text ?? ""}
                          side={to.side}
                          enterFrame={0}
                          holdFrames={9999}
                          accentColor={to.color}
                        />
                      ) : to.type === "glow" ? (
                        <GlowPulse
                          positionX={x / 1080}
                          positionY={y / 1920}
                          color={to.color}
                          radius={to.glowRadius}
                          enterFrame={0}
                        />
                      ) : to.type === "emoji" ? (
                        <div
                          style={{
                            position: "absolute",
                            left: x - 40,
                            top: y - 40,
                            fontSize: 80,
                            lineHeight: 1,
                            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
                          }}
                        >
                          {to.emoji}
                        </div>
                      ) : null
                    }
                  </TrackedOverlay>
                ))}

                {/* Person burst — elements emerging from behind speaker */}
                {PERSON_BURSTS.map((pb, i) => (
                  <PersonBurst key={i} {...pb} />
                ))}

                {/* Text pops */}
                {TEXT_POPS.map((tp, i) => (
                  <TextPop key={i} {...tp} />
                ))}

                {/* Typewriter texts */}
                {TYPEWRITERS.map((tw, i) => (
                  <TypewriterText key={i} {...tw} />
                ))}

                {/* Text scrambles */}
                {SCRAMBLES.map((sc, i) => (
                  <TextScramble key={i} {...sc} />
                ))}

                {/* Gradient texts */}
                {GRADIENT_TEXTS.map((gt, i) => (
                  <GradientText key={i} {...gt} />
                ))}

                {/* Word highlights */}
                {WORD_HIGHLIGHTS.map((wh, i) => (
                  <WordHighlight key={i} {...wh} />
                ))}

                {/* Morph texts */}
                {MORPHS.map((mt, i) => (
                  <MorphText key={i} {...mt} />
                ))}

                {/* Countdown timers */}
                {COUNTDOWNS.map((cd, i) => (
                  <CountdownTimer key={i} {...cd} />
                ))}

                {/* Progress rings */}
                {PROGRESS_RINGS.map((pr, i) => (
                  <ProgressRing key={i} {...pr} />
                ))}

                {/* Confirm checks */}
                {CHECKS.map((ck, i) => (
                  <ConfirmCheck key={i} {...ck} />
                ))}

                {/* Lower thirds */}
                {LOWER_THIRDS.map((lt, i) => (
                  <LowerThird key={i} {...lt} />
                ))}

                {/* Chapter markers + progress bar */}
                <ChapterMarker
                  totalFrames={VIDEO_CONFIG.durationInFrames}
                  chapters={CHAPTERS}
                  showProgressBar={CHAPTERS.length > 0}
                />

                {/* Logo watermark */}
                {LOGO.show && (
                  <LogoWatermark corner={LOGO.corner} fadeInFrame={LOGO.fadeInFrame} />
                )}

                {/* Bullet lists */}
                {BULLET_LISTS.map((bl, i) => (
                  <BulletList key={i} {...bl} />
                ))}

                {/* Stat cards */}
                {STAT_CARDS.map((sc, i) => (
                  <StatCard key={i} {...sc} />
                ))}

                {/* Highlight boxes */}
                {HIGHLIGHTS.map((h, i) => (
                  <HighlightBox key={i} {...h} />
                ))}

                {/* CTA buttons */}
                {CTA_BUTTONS.map((btn, i) => (
                  <CTAButton key={i} {...btn} />
                ))}

                {/* Phone notifications — near top */}
                {NOTIFICATIONS.map((n, i) => (
                  <PhoneNotification key={i} {...n} />
                ))}

                {/* Chat bubbles */}
                {CHATS.map((ch, i) => (
                  <ChatBubble key={i} {...ch} />
                ))}

                {/* Kinetic text — word-by-word */}
                {KINETIC_TEXTS.map((kt, i) => (
                  <KineticText key={i} {...kt} />
                ))}

                {/* Reaction bubbles */}
                {REACTIONS.length > 0 && <ReactionBubble reactions={REACTIONS} />}

                {/* Floating emojis — TikTok-style */}
                {FLOATING_EMOJIS.length > 0 && (
                  <FloatingEmoji emojis={FLOATING_EMOJIS} />
                )}

                {/* Punch transitions */}
                {PUNCHES.length > 0 && <PunchTransition punches={PUNCHES} />}

                {/* Social handles */}
                {SOCIAL_HANDLES.map((sh, i) => (
                  <SocialHandle key={i} {...sh} />
                ))}

                {/* Outro screen */}
                {OUTRO.show && (
                  <OutroScreen
                    enterFrame={OUTRO.enterFrame}
                    ctaText={OUTRO.ctaText}
                    subText={OUTRO.subText}
                    linkText={OUTRO.linkText}
                  />
                )}

                {/* Lens flares — screen blend, above everything */}
                {LENS_FLARES.length > 0 && (
                  <LensFlare events={LENS_FLARES} />
                )}

                {/* Anamorphic streaks */}
                {ANAMORPHIC_STREAKS.length > 0 && (
                  <AnamorphicStreak events={ANAMORPHIC_STREAKS} />
                )}

                {/* TextLineReveal — AE-style text reveals */}
                {TEXT_LINE_REVEALS.map((tlr, i) => (
                  <TextLineReveal key={i} {...tlr} />
                ))}

                {/* AEText — After Effects Rise Up per-character animation */}
                {AE_TEXTS.map((ae, i) => (
                  <AEText key={i} {...ae} />
                ))}

                {/* Fade transitions — always last */}
                {FADES.map((f, i) => (
                  <FadeTransition key={i} {...f} />
                ))}

              </CameraShake>
            </WhipPan>
          </ContinuousDrift>
        </SmartZoom>
      </ZoomBurst>
      </DepthOfField>
      </MotionBlur>
      </ChromaticAberration>
    </AbsoluteFill>
  );
};
