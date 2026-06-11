import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export interface ChatMessage {
  text: string;
  frame: number;
  sender: "me" | "them";
  /** emoji avatar, default 👤 */
  avatar?: string;
  /** sender name shown on first message from "them" */
  name?: string;
}

interface ChatBubbleProps {
  messages: ChatMessage[];
  title?: string;
  titleAvatar?: string;
  positionY?: number;
}

const BUBBLE_H = 115;
const HEADER_H = 100;
const GAP = 14;

const Message: React.FC<{
  msg: ChatMessage;
  frame: number;
  fps: number;
  bottomOffset: number;
}> = ({ msg, frame, fps, bottomOffset }) => {
  const isMe = msg.sender === "me";

  const enter = spring({
    frame: Math.max(0, frame - msg.frame),
    fps,
    config: { damping: 16, stiffness: 220, mass: 0.7 },
  });

  const opacity = interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(enter, [0, 1], [36, 0]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomOffset,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        paddingLeft: isMe ? 60 : 20,
        paddingRight: isMe ? 20 : 60,
        opacity,
        transform: `translateY(${ty}px)`,
      }}
    >
      {!isMe && (
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueL})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            marginLeft: 10,
            flexShrink: 0,
            alignSelf: "flex-end",
          }}
        >
          {msg.avatar ?? "👤"}
        </div>
      )}

      <div
        style={{
          background: isMe ? "#25D366" : BRAND.bgF,
          borderRadius: isMe ? "22px 22px 4px 22px" : "22px 22px 22px 4px",
          padding: "16px 22px",
          maxWidth: "72%",
          boxShadow: "0 2px 16px rgba(0,0,0,0.45)",
          border: isMe ? "none" : `1px solid ${BRAND.border}`,
        }}
      >
        {msg.name && !isMe && (
          <div
            style={{
              fontFamily: "'Heebo', sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: BRAND.blueL,
              marginBottom: 6,
              direction: "rtl",
            }}
          >
            {msg.name}
          </div>
        )}
        <div
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontSize: 32,
            fontWeight: 500,
            color: "#fff",
            direction: "rtl",
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
          }}
        >
          {msg.text}
        </div>
        {isMe && (
          <div
            style={{
              textAlign: "left",
              fontSize: 20,
              color: "rgba(255,255,255,0.65)",
              marginTop: 4,
              direction: "ltr",
            }}
          >
            ✓✓
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  messages,
  title = "לקוח",
  titleAvatar = "👤",
  positionY = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sorted = [...messages].sort((a, b) => a.frame - b.frame);
  const firstFrame = sorted[0]?.frame ?? 0;

  const headerEnter = spring({
    frame: Math.max(0, frame - Math.max(0, firstFrame - 10)),
    fps,
    config: { damping: 18, stiffness: 210, mass: 0.75 },
  });
  const headerOpacity = interpolate(headerEnter, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const headerTy = interpolate(headerEnter, [0, 1], [-24, 0]);

  const messagesAreaH = sorted.length * (BUBBLE_H + GAP) + 28;
  const totalH = HEADER_H + messagesAreaH;
  const top = positionY * 1920 - totalH / 2;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 48,
        right: 48,
        background: "rgba(14,22,40,0.93)",
        backdropFilter: "blur(20px)",
        borderRadius: 28,
        border: `1.5px solid ${BRAND.border}`,
        boxShadow: "0 20px 70px rgba(0,0,0,0.7)",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 24px",
          borderBottom: `1px solid rgba(255,255,255,0.07)`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "rgba(255,255,255,0.025)",
          opacity: headerOpacity,
          transform: `translateY(${headerTy}px)`,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            boxShadow: "0 0 16px #25D36655",
          }}
        >
          {titleAvatar}
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Heebo', sans-serif",
              fontWeight: 700,
              fontSize: 32,
              color: BRAND.text,
              direction: "rtl",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "'Heebo', sans-serif",
              fontSize: 22,
              color: "#25D366",
            }}
          >
            מחובר
          </div>
        </div>
        <div style={{ marginRight: "auto", fontSize: 28 }}>📞</div>
      </div>

      {/* Messages */}
      <div
        style={{
          position: "relative",
          height: messagesAreaH,
          padding: "14px 0",
        }}
      >
        {sorted.map((msg, i) => (
          <Message
            key={i}
            msg={msg}
            frame={frame}
            fps={fps}
            bottomOffset={(sorted.length - 1 - i) * (BUBBLE_H + GAP) + 14}
          />
        ))}
      </div>
    </div>
  );
};
