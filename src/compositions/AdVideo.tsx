import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

const clips = [
  { file: "scene1_商品フォーカス.mp4", telop: "割ったら、とろけた", durationInFrames: 241 },
  { file: "scene2_女性×商品.mp4", telop: "この幸福、贈りたい", durationInFrames: 257 },
  { file: "scene3_シネマティック.mp4", telop: "今夜、自分を甘やかして", durationInFrames: 257 },
];

const Telop: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  // 右からスライドイン＋フェード（0〜24フレーム）
  const opacity = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const translateX = interpolate(frame, [0, 24], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 72,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          opacity,
          transform: `translateX(${translateX}px)`,
        }}
      >
        {/* 縦書きテキスト */}
        <div
          style={{
            writingMode: "vertical-rl",
            color: "white",
            fontSize: 72,
            fontWeight: 300,
            letterSpacing: "0.18em",
            fontFamily: "Hiragino Mincho ProN, YuMincho, serif",
            textShadow: "0 2px 16px rgba(0,0,0,0.85)",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FLASH_FRAMES = 8;

const WhiteFlash: React.FC = () => {
  const frame = useCurrentFrame();
  // 各クリップの切り替えフレームを動的に計算
  const transitions = clips.reduce<number[]>((acc, clip, i) => {
    if (i === 0) return acc;
    const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
    return [...acc, (i === 1 ? clips[0].durationInFrames : prev) + (i > 1 ? clips[i - 1].durationInFrames : 0)];
  }, [clips[0].durationInFrames, clips[0].durationInFrames + clips[1].durationInFrames]);

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
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("narration.wav")} volume={0.5} />
      {clips.map(({ file, telop, durationInFrames }) => {
        const start = from;
        from += durationInFrames;
        return (
          <Sequence key={file} from={start} durationInFrames={durationInFrames}>
            <AbsoluteFill>
              <OffthreadVideo src={staticFile(file)} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center center" }} />
              <Telop text={telop} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <WhiteFlash />
    </AbsoluteFill>
  );
};
