# Paper 制作プロジェクト

## WHY
チラシ・バナー・広告の**静止画デザイン**と、ショート動画広告の**動画制作**を扱う。
静止画 → Paper MCP / 動画 → Remotion + VOICEVOX

## プロジェクト構成
```
Paper/
├── 作業中動画/         # 制作中クリップ + テロップとナレーション.md + narration.wav
├── public/             # Remotion用アセット（動画・音声）
├── src/compositions/
│   └── AdVideo.tsx     # Remotionコンポジション
├── skills/             # スキル本体（~/.claude/skillsへシンボリックリンク）
├── scripts/
│   └── generate_tts.py # VOICEVOX音声生成
└── CLAUDE.md
```

## コマンド
- Remotion Studio: `npm run studio` → http://localhost:3000
- レンダー: `npm run render` → `out/ad-video.mp4`
- 音声生成: `python3 scripts/generate_tts.py --text "..." --voicevox-id ID --output narration.wav`
- VOICEVOX: GUIアプリ起動必須（localhost:50021）
- 動画確認: `ffmpeg -i <file>` でメタデータ確認、フレーム抽出は `ffmpeg -i <file> -vf "select=eq(n\,0)" -vsync vr frame.png`

## 絶対ルール
- **テロップは毎回ゼロから設計する。前回の動画のフォント・サイズ・配置・色・装飾を絶対に流用しない**
- bannnner.com のバナーを「元ネタ」として使い、そのデザイン処理をそのまま適用する
- 各シーンの参考バナー画像をユーザーに提示し、承認を得てから実装する
- デザインの良し悪しは `デザインの極意書.md` のチェックリストで判断する
- 勝手に大きく変えない。方針は必ずユーザーに確認する

## 動画制作フロー
1. 動画素材を `作業中動画/` に入れる
2. `/kling-video` → Kling（fal.ai経由）で動画クリップ生成
3. `/video-script` → テロップ・ナレーション・音声生成
4. `/telop-design` → bannnner.comパターン辞書からデザイン導出 → AdVideo.tsx実装
5. `public/` に素材コピー → `npm run render`

## スキル一覧
| スキル | 用途 |
|-------|------|
| `/kling-video` | Kling v2.1/v3でクリップ生成。プロンプト作成後に一旦停止してユーザー確認 |
| `/video-script` | テロップ文言・ナレーション・音声生成（VOICEVOX） |
| `/telop-design` | bannnner.comパターン辞書を使ったテロップデザイン設計・AdVideo.tsx実装 |

## telop-designスキルの設計
- パターン辞書: `skills/telop-design/patterns.md`（10パターン、CSS実装例付き）
- マッチングルール: `skills/telop-design/matching-rules.md`（映像→パターン判定フロー）
- フォント・色・装飾: `skills/telop-design/fonts-colors-decorations.md`
- 代表バナー画像: `skills/telop-design/banners/`（P1〜P10各1枚、比較用に永続保存）
- AdVideo.tsxはvariantなしのインラインスタイル構成（clips配列 + render関数で全パターン対応）

## 参照ファイル
| ファイル | 用途 |
|---------|------|
| `デザインの極意書.md` | デザイン判断基準 |
| `日本人デザイナーの哲学・思考・デザインタイプ一覧.md` | スタイル選択基準 |
| `バナー参考サイト.md` | テロップデザインの参考元 |

## Remotion
- 縦型 1080×1920 / 30fps
- AdVideo.tsx: clips配列でSequenceを繋ぐ。P1-P5/P9/P10はcontainerStyle+textStyle、P6/P7/P8はrender関数でカスタム描画

## Klingモデル選択
- 練習・確認用: `fal-ai/kling-video/v2.1/standard/image-to-video`（$0.28/clip）
- 本番: `fal-ai/kling-video/v3/pro/image-to-video`（$1.40/clip）
- motion-control: v2.6以降で使用可能だがタイムアウトしやすい。全身が映る参照動画が必要

## Notes
- スキルは `skills/` が実体、`~/.claude/skills/` はシンボリックリンク
- Paper MCP: `http://127.0.0.1:29979/mcp`（Paper Desktop起動必須）
