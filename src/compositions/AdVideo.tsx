import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";

const CLIP_DURATION_FRAMES = 162; // 5.4秒 × 30fps

const clips = [
  "scene1_商品フォーカス.mp4",
  "scene2_女性×商品.mp4",
  "scene3_シネマティック.mp4",
];

export const AdVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {clips.map((clip, i) => (
        <Sequence
          key={clip}
          from={i * CLIP_DURATION_FRAMES}
          durationInFrames={CLIP_DURATION_FRAMES}
        >
          <OffthreadVideo src={staticFile(clip)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
