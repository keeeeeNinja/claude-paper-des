import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

// ===== クリップ定義 =====
const clips = [
  {
    file: "scene1_困り顔ドライバー_kling_v2.1std.mp4",
    telop: "突然のトラブル…",
    durationInFrames: 151,
    // anime.js style: 下からスライドイン → 上へ抜ける、文字staggerループ
    render: (frame: number) => {
      const text = "突然のトラブル…";
      const MARGIN = 5;        // margin-right: 5px
      const DELAY_FRAMES = 3;  // 100ms @ 30fps
      const FADE_FRAMES = 20;  // fade-in duration

      return (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", paddingBottom: 140, paddingLeft: 56 }}>
          <div style={{ display: "flex" }}>
            {text.split("").map((char, i) => {
              const charFrame = frame - i * DELAY_FRAMES;
              const t = Math.min(1, Math.max(0, charFrame / FADE_FRAMES));
              const opacity = t;
              const translateY = (1 - t) * 16; // 下から16pxせり上がる

              return (
                <span key={i} style={{
                  display: "inline-block",
                  marginRight: MARGIN,
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  fontSize: 84,
                  fontWeight: 900,
                  fontFamily: "Hiragino Mincho ProN, YuMincho, serif",
                  color: "#FFFFFF",
                  textShadow: "0 2px 16px rgba(0,0,0,0.5)",
                }}>
                  {char}
                </span>
              );
            })}
          </div>
        </AbsoluteFill>
      );
    },
  },
  {
    file: "scene2_オペレーター_kling_v2.1std.mp4",
    telop: "24時間365日対応",
    durationInFrames: 151,
    // P8: 下部帯テキスト型 — render関数で実装
    render: (frame: number) => (
      <AbsoluteFill style={{
        justifyContent: "flex-end",
        alignItems: "stretch",
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [0, 20], [40, 0], { extrapolateRight: "clamp" })}px)`,
      }}>
        <div style={{
          backgroundColor: "rgba(0,0,0,0.50)",
          paddingTop: 24,
          paddingBottom: 32,
          paddingLeft: 48,
          paddingRight: 48,
          textAlign: "center" as const,
          width: "100%",
        }}>
          <div style={{
            fontSize: 52,
            fontWeight: 500,
            fontFamily: "Hiragino Sans, sans-serif",
            letterSpacing: "0.18em",
            color: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
          }}>
            {"24時間365日対応".split("").map((char, i) => {
              const CHAR_DELAY = 5;
              const FADE_FRAMES = 20;
              const charAppearFrame = i * CHAR_DELAY;
              const age = frame - charAppearFrame;
              const t = Math.min(1, Math.max(0, age / FADE_FRAMES));
              const opacity = t;
              const translateY = (1 - t) * 30;
              return (
                <span key={i} style={{ opacity, transform: `translateY(${translateY}px)`, display: "inline-block" }}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    ),
  },
  {
    file: "scene3_安堵ドライバー_kling_v2.1std.mp4",
    telop: "東京海上アシスタンス",
    durationInFrames: 151,
    // P2: 中央ブランドロゴ型 + 左下ロゴ
    render: (frame: number) => {
      const logoOpacity = interpolate(frame, [20, 70], [0, 1], { extrapolateRight: "clamp" });
      const logoBlur = interpolate(frame, [20, 70], [12, 0], { extrapolateRight: "clamp" });

      return (
        <>
          {/* タイプライター: パーティクル収束後（frame 70〜）に1文字ずつ現れる */}
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            {(() => {
              const text = "東京海上アシスタンス";
              const startFrame = 20;
              // 30フレームで全文字を打つ
              const localFrame = Math.max(0, frame - startFrame);
              const charsPerFrame = text.length / 30;
              const visibleCount = Math.min(text.length, Math.floor(localFrame * charsPerFrame));
              // カーソル点滅（8フレーム周期）、1文字以上出てから・全文字出たら消える
              const cursorVisible = visibleCount > 0 && visibleCount < text.length && Math.floor(frame / 8) % 2 === 0;
              const showBorder = visibleCount > 0;
              // もわっと出現: 各文字が現れてから12フレームかけてblur解除+opacity増加
              const FADE_FRAMES = 40;

              return (
                <div style={{
                  fontSize: 96,
                  fontWeight: 300,
                  fontFamily: "Hiragino Mincho ProN, YuMincho, serif",
                  letterSpacing: "0.06em",
                  color: "#1B3A7A",
                  whiteSpace: "nowrap" as const,
                  display: "flex",
                  paddingBottom: "20px",
                }}>
                  {text.split("").map((char, i) => {
                    const charAppearFrame = startFrame + Math.floor(i / charsPerFrame);
                    const age = frame - charAppearFrame; // この文字が出てから何フレーム経ったか
                    if (age < 0) return null;
                    const t = Math.min(1, age / FADE_FRAMES);
                    const opacity = t;
                    const blur = (1 - t) * 24;
                    return (
                      <span key={i} style={{ opacity, filter: `blur(${blur}px)` }}>{char}</span>
                    );
                  })}
                  {cursorVisible && <span style={{ marginLeft: 2 }}>|</span>}
                </div>
              );
            })()}
          </AbsoluteFill>
          {/* ロゴ: 左上にもわっと表示 */}
          <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start", padding: "80px 0 0 56px" }}>
            <Img
              src={staticFile("TMAS_LOGO.jpg")}
              style={{
                width: 200,
                opacity: logoOpacity,
                filter: `blur(${logoBlur}px)`,
                mixBlendMode: "multiply" as const,
              }}
            />
          </AbsoluteFill>
        </>
      );
    },
  },
];

// ===== Telopコンポーネント =====
// P1-P5, P9, P10: containerStyle + textStyle で描画
// P6, P7, P8: render関数でカスタム描画
const Telop: React.FC<(typeof clips)[number]> = (clip) => {
  const frame = useCurrentFrame();
  if (clip.render) return clip.render(frame);
  const { telop, containerStyle, textStyle, animation } = clip;
  return (
    <AbsoluteFill style={containerStyle}>
      <div style={{ ...textStyle, ...animation!(frame) }}>{telop}</div>
    </AbsoluteFill>
  );
};

// ===== トランジション（白フラッシュ）=====
const FLASH_FRAMES = 8;
const WhiteFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const transitions: number[] = [];
  let acc = 0;
  for (let i = 0; i < clips.length - 1; i++) {
    acc += clips[i].durationInFrames;
    transitions.push(acc);
  }
  const opacity = transitions.reduce((o, t) => {
    const dist = Math.abs(frame - t);
    if (dist > FLASH_FRAMES) return o;
    return Math.max(o, interpolate(dist, [0, FLASH_FRAMES], [0.8, 0], { extrapolateRight: "clamp" }));
  }, 0);
  if (opacity === 0) return null;
  return <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${opacity})`, zIndex: 10 }} />;
};

// ===== メインコンポーネント =====
export const AdVideo: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("narration.wav")} volume={0.9} />
      {clips.map((clip) => {
        const start = from;
        from += clip.durationInFrames;
        return (
          <Sequence key={clip.file} from={start} durationInFrames={clip.durationInFrames}>
            <AbsoluteFill>
              <OffthreadVideo
                src={staticFile(clip.file)}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
              />
              <Telop {...clip} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <WhiteFlash />
    </AbsoluteFill>
  );
};
