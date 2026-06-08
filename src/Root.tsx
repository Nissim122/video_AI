import "./index.css";
import { Composition } from "remotion";
import { MyComposition, CompositionSchema } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={150}
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
