// ─────────────────────────────────────────────────────────────────────────────
// VideoEditor — מנוע עריכת סרטון גנרי
// כל סרטון מגדיר config ב-src/videos/[name]/config.ts ומעביר אותו לכאן
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import type { VideoEditConfig } from "./videos/VideoEditorTypes";

import { VideoBase } from "./components/VideoBase";
import { LogoWatermark } from "./components/LogoWatermark";
import { ChapterMarker } from "./components/ChapterMarker";
import { PictureInPicture } from "./components/PictureInPicture";
import { LowerThird } from "./components/LowerThird";
import { TextPop } from "./components/TextPop";
import { Callout } from "./components/Callout";
import { OutroScreen } from "./components/OutroScreen";
import { VignetteGrade } from "./components/VignetteGrade";
import { FadeTransition } from "./components/FadeTransition";
import { KineticText } from "./components/KineticText";
import { BRollOverlay } from "./components/BRollOverlay";
import { ReactionBubble } from "./components/ReactionBubble";
import { PunchTransition } from "./components/PunchTransition";
import { BulletList } from "./components/BulletList";
import { StatCard } from "./components/StatCard";
import { HighlightBox } from "./components/HighlightBox";
import { CTAButton } from "./components/CTAButton";
import { SocialHandle } from "./components/SocialHandle";
import { TypewriterText } from "./components/TypewriterText";
import { MorphText } from "./components/MorphText";
import { TextScramble } from "./components/TextScramble";
import { GradientText } from "./components/GradientText";
import { WordHighlight } from "./components/WordHighlight";
import { ChatBubble } from "./components/ChatBubble";
import { PhoneNotification } from "./components/PhoneNotification";
import { ConfirmCheck } from "./components/ConfirmCheck";
import { ProgressRing } from "./components/ProgressRing";
import { AutomationFlow } from "./components/AutomationFlow";
import { CameraShake } from "./components/CameraShake";
import { SpotlightReveal } from "./components/SpotlightReveal";
import { ZoomBurst } from "./components/ZoomBurst";
import { ParticleField } from "./components/ParticleField";
import { GlowPulse } from "./components/GlowPulse";
import { DrawPath } from "./components/DrawPath";
import { CountdownTimer } from "./components/CountdownTimer";
import { FloatingEmoji } from "./components/FloatingEmoji";
import { TrackedOverlay } from "./components/TrackedOverlay";
import { SmartZoom } from "./components/SmartZoom";
import { WhipPan } from "./components/WhipPan";
import { ContinuousDrift } from "./components/ContinuousDrift";
import { MotionBlur } from "./components/MotionBlur";
import { DepthOfField } from "./components/DepthOfField";
import { LensFlare } from "./components/LensFlare";
import { ChromaticAberration } from "./components/ChromaticAberration";
import { TextLineReveal } from "./components/TextLineReveal";
import { AnamorphicStreak } from "./components/AnamorphicStreak";
import { PersonBurst } from "./components/PersonBurst";
import { AEText } from "./components/AEText";

export const VideoEditor: React.FC<VideoEditConfig> = (config) => {
  const {
    src, durationInFrames,
    grade, logo, outro, drift, caConfig, particleField,
    pips, chapters, lowerThirds, textPops, callouts, fades,
    bulletLists, statCards, highlights, ctaButtons, socialHandles,
    kineticTexts, brolls, reactions, punches,
    typewriters, morphs, scrambles, gradientTexts, wordHighlights,
    chats, notifications, checks, progressRings, flows,
    shakes, spotlights, zoomBursts, glowPulses, drawPaths,
    countdowns, floatingEmojis, smartZooms, whipPans,
    trackedOverlays, personBursts,
    motionBlurs, dofEvents, lensFlares, caConfig: _ca,
    textLineReveals, anamorphicStreaks, aeTexts,
  } = config;

  const topGradient =
    "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, transparent 55%)";

  return (
    <AbsoluteFill>
      <ChromaticAberration
        baseIntensity={caConfig.enabled ? caConfig.baseIntensity : 0}
        events={caConfig.enabled ? caConfig.events : []}
      >
      <MotionBlur events={motionBlurs}>
      <DepthOfField events={dofEvents}>
      <ZoomBurst bursts={zoomBursts}>
        <SmartZoom events={smartZooms}>
          <ContinuousDrift
            enabled={drift.enabled}
            mode={drift.mode}
            panAmount={drift.panAmount}
            zoomAmount={drift.zoomAmount}
            speed={drift.speed}
          >
            <WhipPan whips={whipPans}>
              <CameraShake shakes={shakes}>

                {/* Base video */}
                <VideoBase src={src} />

                {/* Particle field */}
                {particleField.show && (
                  <ParticleField
                    count={particleField.count}
                    color={particleField.color}
                    dotSize={particleField.dotSize}
                    speed={particleField.speed}
                    connected={particleField.connected}
                    opacity={particleField.opacity}
                    enterFrame={particleField.enterFrame}
                  />
                )}

                {/* Glow pulses */}
                {glowPulses.map((gp, i) => <GlowPulse key={i} {...gp} />)}

                {/* Top vignette */}
                <AbsoluteFill style={{ background: topGradient, pointerEvents: "none" }} />

                {/* B-Roll overlays */}
                {brolls.map((br, i) => <BRollOverlay key={i} {...br} />)}

                {/* Vignette + color grade */}
                {grade.show && (
                  <VignetteGrade
                    vignetteStrength={grade.vignetteStrength}
                    tone={grade.tone}
                    brightness={grade.brightness}
                    contrast={grade.contrast}
                  />
                )}

                {/* Spotlight reveals */}
                {spotlights.map((sp, i) => <SpotlightReveal key={i} {...sp} />)}

                {/* Draw paths */}
                {drawPaths.map((dp, i) => <DrawPath key={i} {...dp} />)}

                {/* PiP overlays */}
                {pips.map((pip, i) => <PictureInPicture key={i} {...pip} />)}

                {/* Automation flow diagrams */}
                {flows.map((fl, i) => <AutomationFlow key={i} {...fl} />)}

                {/* Callouts */}
                {callouts.map((c, i) => <Callout key={i} {...c} />)}

                {/* Tracked overlays */}
                {trackedOverlays.map((to, i) => (
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
                          arrowX={x} arrowY={y}
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
                      ) : (
                        <div style={{ position: "absolute", left: x - 40, top: y - 40, fontSize: 80, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>
                          {to.emoji}
                        </div>
                      )
                    }
                  </TrackedOverlay>
                ))}

                {/* Person bursts */}
                {personBursts.map((pb, i) => <PersonBurst key={i} {...pb} />)}

                {/* Text pops */}
                {textPops.map((tp, i) => <TextPop key={i} {...tp} />)}

                {/* Typewriter texts */}
                {typewriters.map((tw, i) => <TypewriterText key={i} {...tw} />)}

                {/* Text scrambles */}
                {scrambles.map((sc, i) => <TextScramble key={i} {...sc} />)}

                {/* Gradient texts */}
                {gradientTexts.map((gt, i) => <GradientText key={i} {...gt} />)}

                {/* Word highlights */}
                {wordHighlights.map((wh, i) => <WordHighlight key={i} {...wh} />)}

                {/* Morph texts */}
                {morphs.map((mt, i) => <MorphText key={i} {...mt} />)}

                {/* Countdown timers */}
                {countdowns.map((cd, i) => <CountdownTimer key={i} {...cd} />)}

                {/* Progress rings */}
                {progressRings.map((pr, i) => <ProgressRing key={i} {...pr} />)}

                {/* Confirm checks */}
                {checks.map((ck, i) => <ConfirmCheck key={i} {...ck} />)}

                {/* Lower thirds */}
                {lowerThirds.map((lt, i) => <LowerThird key={i} {...lt} />)}

                {/* Chapter markers */}
                <ChapterMarker
                  totalFrames={durationInFrames}
                  chapters={chapters}
                  showProgressBar={chapters.length > 0}
                />

                {/* Logo watermark */}
                {logo.show && (
                  <LogoWatermark corner={logo.corner} fadeInFrame={logo.fadeInFrame} />
                )}

                {/* Bullet lists */}
                {bulletLists.map((bl, i) => <BulletList key={i} {...bl} />)}

                {/* Stat cards */}
                {statCards.map((sc, i) => <StatCard key={i} {...sc} />)}

                {/* Highlight boxes */}
                {highlights.map((h, i) => <HighlightBox key={i} {...h} />)}

                {/* CTA buttons */}
                {ctaButtons.map((btn, i) => <CTAButton key={i} {...btn} />)}

                {/* Phone notifications */}
                {notifications.map((n, i) => <PhoneNotification key={i} {...n} />)}

                {/* Chat bubbles */}
                {chats.map((ch, i) => <ChatBubble key={i} {...ch} />)}

                {/* Kinetic text */}
                {kineticTexts.map((kt, i) => <KineticText key={i} {...kt} />)}

                {/* Reaction bubbles */}
                {reactions.length > 0 && <ReactionBubble reactions={reactions} />}

                {/* Floating emojis */}
                {floatingEmojis.length > 0 && <FloatingEmoji emojis={floatingEmojis} />}

                {/* Punch transitions */}
                {punches.length > 0 && <PunchTransition punches={punches} />}

                {/* Social handles */}
                {socialHandles.map((sh, i) => <SocialHandle key={i} {...sh} />)}

                {/* Outro screen */}
                {outro.show && (
                  <OutroScreen
                    enterFrame={outro.enterFrame}
                    ctaText={outro.ctaText}
                    subText={outro.subText}
                    linkText={outro.linkText}
                  />
                )}

                {/* Lens flares */}
                {lensFlares.length > 0 && <LensFlare events={lensFlares} />}

                {/* Anamorphic streaks */}
                {anamorphicStreaks.length > 0 && <AnamorphicStreak events={anamorphicStreaks} />}

                {/* TextLineReveal */}
                {textLineReveals.map((tlr, i) => <TextLineReveal key={i} {...tlr} />)}

                {/* AEText */}
                {aeTexts.map((ae, i) => <AEText key={i} {...ae} />)}

                {/* Fade transitions — תמיד אחרון */}
                {fades.map((f, i) => <FadeTransition key={i} {...f} />)}

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
