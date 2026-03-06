import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

type TelopVariant = "scene1" | "scene2" | "scene3";

const clips: { file: string; telop: string; durationInFrames: number; variant: TelopVariant }[] = [
  { file: "scene1_商品フォーカス_kling_v2.6pro.mp4", telop: "とろける、この瞬間", durationInFrames: 150, variant: "scene1" },
  { file: "scene2_女性×商品_kling_v2.6pro.mp4",      telop: "特別な夜にふさわしい",  durationInFrames: 150, variant: "scene2" },
  { file: "scene3_シネマティック_kling_v2.6pro.mp4",  telop: "あなたも体験して",      durationInFrames: 153, variant: "scene3" },
];

const Telop: React.FC<{ text: string; variant: TelopVariant }> = ({ text, variant }) => {
  const frame = useCurrentFrame();

  // Scene 1: Meltykiss型 — 下部左寄せ・太ゴシック・ダークブラウン
  if (variant === "scene1") {
    const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    const translateY = interpolate(frame, [0, 20], [12, 0], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", paddingBottom: 100, paddingLeft: 56 }}>
        <div
          style={{
            opacity,
            transform: `translateY(${translateY}px)`,
            fontSize: 86,
            fontWeight: 800,
            fontFamily: "Hiragino Sans, sans-serif",
            letterSpacing: "0.02em",
            color: "#3B1E0E",
            lineHeight: 1.2,
          }}
        >
          {text}
        </div>
      </AbsoluteFill>
    );
  }

  // Scene 2: BANANA REPUBLIC型 — 下部中央・細明朝・白・広spacing
  if (variant === "scene2") {
    const opacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 100 }}>
        <div
          style={{
            opacity,
            fontSize: 64,
            fontWeight: 300,
            fontFamily: "Hiragino Mincho ProN, YuMincho, serif",
            letterSpacing: "0.3em",
            color: "white",
            textShadow: "0 2px 24px rgba(0,0,0,0.6)",
          }}
        >
          {text}
        </div>
      </AbsoluteFill>
    );
  }

  // Scene 3: 4°C BRIDAL型 — 右側縦書き・細明朝・白〜淡ゴールド
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-end", paddingRight: 72 }}>
      <div
        style={{
          opacity,
          writingMode: "vertical-rl",
          fontSize: 72,
          fontWeight: 300,
          fontFamily: "Hiragino Mincho ProN, YuMincho, serif",
          letterSpacing: "0.35em",
          color: "#F5E6C8",
          textShadow: "0 1px 20px rgba(0,0,0,0.5)",
          lineHeight: 1,
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
      <Audio src={staticFile("narration.wav")} volume={0.85} />
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
