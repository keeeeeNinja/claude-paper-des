import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export const AdVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: 60 }}>広告動画テスト</h1>
      <p>
        フレーム: {frame} / 秒: {(frame / fps).toFixed(1)}
      </p>
    </AbsoluteFill>
  );
};
