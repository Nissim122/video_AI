import "./index.css";
import React from "react";
import { Composition, AbsoluteFill, staticFile, Img } from "remotion";
import { MyComposition, CompositionSchema } from "./Composition";
import { T } from "./scenes/timeline";
import { PhoneEntrance, PhoneVariant } from "./components/PhoneEntrance";
import { loadFont } from "@remotion/google-fonts/Heebo";
import { BRAND } from "./brand";

const { fontFamily } = loadFont();

const VARIANTS: PhoneVariant[] = ["slideUp", "perspectiveLeft", "floatIn", "dropBounce"];
const LABELS: Record<PhoneVariant, string> = {
  slideUp: "Slide Up",
  perspectiveLeft: "Perspective Left",
  floatIn: "Float In",
  dropBounce: "Drop Bounce",
};

const PhoneShowcase: React.FC = () => (
  <AbsoluteFill
    style={{
      background: BRAND.bg,
      fontFamily,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      padding: "60px 40px",
    }}
  >
    {VARIANTS.map((variant, i) => (
      <div
        key={variant}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          transform: "scale(0.32)",
          transformOrigin: "top center",
        }}
      >
        <PhoneEntrance variant={variant} delay={i * 8}>
          <Img
            src={staticFile("screen-1-pain.jpeg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </PhoneEntrance>
        <div
          style={{
            color: BRAND.blueL,
            fontSize: 48,
            fontWeight: 700,
            whiteSpace: "nowrap",
            marginTop: -780,
          }}
        >
          {LABELS[variant]}
        </div>
      </div>
    ))}
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PhoneShowcase"
        component={PhoneShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={600}
      />
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={T.total}
        fps={30}
        width={1080}
        height={1920}
        schema={CompositionSchema}
        defaultProps={{
          hookText: "כמה שעות בשבוע אתה מבזבז על עבודה שחוזרת על עצמה?",
          subText: "פולואפים, תיאומים, דוחות, שיווק...",
          ctaText: "בחר מה מפריע לך",
          screenImage: "screen-1-pain.jpeg",
        }}
      />
    </>
  );
};
