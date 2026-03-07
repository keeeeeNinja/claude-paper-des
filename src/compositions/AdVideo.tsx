import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

type TelopVariant = "scene1" | "scene2" | "scene3";

const clips: { file: string; telop: string; durationInFrames: number; variant: TelopVariant }[] = [
  { file: "scene1_商品フォーカス_kling_v2.1std.mp4", telop: "肌が変わる、\n朝が変わる。", durationInFrames: 150, variant: "scene1" },
  { file: "scene2_洗顔シーン_kling_v2.1std.mp4",     telop: "うるおいを守る\n泡立ち",       durationInFrames: 150, variant: "scene2" },
  { file: "scene3_洗い上がり_kling_v2.1std.mp4",      telop: "今すぐチェック",               durationInFrames: 150, variant: "scene3" },
];

const Telop: React.FC<{ text: string; variant: TelopVariant }> = ({ text, variant }) => {
  const frame = useCurrentFrame();

  // Scene 1: TOANN型 — 下部左寄せ・太ゴシック・白
  if (variant === "scene1") {
    const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    const translateY = interpolate(frame, [0, 20], [16, 0], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", paddingBottom: 140, paddingLeft: 56 }}>
        <div
          style={{
            opacity,
            transform: `translateY(${translateY}px)`,
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "Hiragino Sans, sans-serif",
            letterSpacing: "0.04em",
            color: "#FFFFFF",
            lineHeight: 1.35,
            whiteSpace: "pre-line",
            textShadow: "0 2px 16px rgba(0,0,0,0.4)",
          }}
        >
          {text}
        </div>
      </AbsoluteFill>
    );
  }

  // Scene 2: willone型 — 上部左寄せ・超太ゴシック・白
  if (variant === "scene2") {
    const opacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start", paddingTop: 200, paddingLeft: 56 }}>
        <div
          style={{
            opacity,
            fontSize: 68,
            fontWeight: 800,
            fontFamily: "Hiragino Sans, sans-serif",
            letterSpacing: "0.02em",
            color: "#FFFFFF",
            lineHeight: 1.4,
            whiteSpace: "pre-line",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </div>
      </AbsoluteFill>
    );
  }

  // Scene 3: IPSA型 — 左上・細ゴシック・ダークグレー・ミニマル
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 160 }}>
      <div
        style={{
          opacity,
          fontSize: 52,
          fontWeight: 300,
          fontFamily: "Hiragino Sans, sans-serif",
          letterSpacing: "0.15em",
          color: "#2A2A2A",
          lineHeight: 1.5,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const FLASH_FRAMES = 8;

const WhiteFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const transitions = [
    clips[0].durationInFrames,
    clips[0].durationInFrames + clips[1].durationInFrames,
  ];
  const opacity = transitions.reduce((acc, t) => {
    const dist = Math.abs(frame - t);
    if (dist > FLASH_FRAMES) return acc;
    return Math.max(acc, interpolate(dist, [0, FLASH_FRAMES], [0.8, 0], { extrapolateRight: "clamp" }));
  }, 0);

  if (opacity === 0) return null;
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${opacity})`, zIndex: 10 }} />
  );
};

export const AdVideo: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("narration.wav")} volume={0.5} />
      {clips.map(({ file, telop, durationInFrames, variant }) => {
        const start = from;
        from += durationInFrames;
        return (
          <Sequence key={file} from={start} durationInFrames={durationInFrames}>
            <AbsoluteFill>
              <OffthreadVideo
                src={staticFile(file)}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
              />
              <Telop text={telop} variant={variant} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <WhiteFlash />
    </AbsoluteFill>
  );
};
