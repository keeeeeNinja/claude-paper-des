import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from "remotion";

const CLIP_DURATION_FRAMES = 162; // 5.4秒 × 30fps

const clips = [
  { file: "scene1_商品フォーカス.mp4", telop: "肌が変わる、水が変える" },
  { file: "scene2_女性×商品.mp4", telop: "美肌の秘密はこの1本" },
  { file: "scene3_シネマティック.mp4", telop: "保存して今夜から試して" },
];

export const AdVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("narration.wav")} />
      {clips.map(({ file, telop }, i) => (
        <Sequence
          key={file}
          from={i * CLIP_DURATION_FRAMES}
          durationInFrames={CLIP_DURATION_FRAMES}
        >
          <AbsoluteFill>
            <OffthreadVideo src={staticFile(file)} />
            <AbsoluteFill
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: 120,
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0.55)",
                  color: "white",
                  fontSize: 64,
                  fontWeight: "bold",
                  padding: "18px 48px",
                  borderRadius: 12,
                  letterSpacing: "0.05em",
                  fontFamily: "Hiragino Sans, sans-serif",
                }}
              >
                {telop}
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
