import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

const CLIP_DURATION_FRAMES = 162; // 5.4秒 × 30fps

const clips = [
  { file: "scene1_商品フォーカス.mp4", telop: "肌が変わる、水が変える" },
  { file: "scene2_女性×商品.mp4", telop: "美肌の秘密はこの1本" },
  { file: "scene3_シネマティック.mp4", telop: "保存して今夜から試して" },
];

const Telop: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 20], [0.95, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 160,
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 72,
          fontWeight: 300,
          letterSpacing: "0.12em",
          fontFamily: "Hiragino Sans, sans-serif",
          textShadow: "0 2px 12px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)",
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const FLASH_FRAMES = 8; // フラッシュの片側フレーム数（計16フレーム = 約0.5秒）

const WhiteFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const transitions = [1, 2].map((i) => i * CLIP_DURATION_FRAMES);

  const opacity = transitions.reduce((acc, t) => {
    const dist = Math.abs(frame - t);
    if (dist > FLASH_FRAMES) return acc;
    return Math.max(acc, interpolate(dist, [0, FLASH_FRAMES], [1, 0], { extrapolateRight: "clamp" }));
  }, 0);

  if (opacity === 0) return null;
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${opacity})`, zIndex: 10 }} />
  );
};

export const AdVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("narration.wav")} volume={0.5} />
      {clips.map(({ file, telop }, i) => (
        <Sequence
          key={file}
          from={i * CLIP_DURATION_FRAMES}
          durationInFrames={CLIP_DURATION_FRAMES}
        >
          <AbsoluteFill>
            <OffthreadVideo src={staticFile(file)} />
            <Telop text={telop} />
          </AbsoluteFill>
        </Sequence>
      ))}
      <WhiteFlash />
    </AbsoluteFill>
  );
};
