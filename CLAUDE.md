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

## 絶対ルール
- **テロップは毎回ゼロから設計する。前回の動画のフォント・サイズ・配置・色・装飾を絶対に流用しない**
- bannnner.com のバナーを「元ネタ」として使い、そのデザイン処理をそのまま適用する
- 各シーンの参考バナー画像をユーザーに提示し、承認を得てから実装する
- デザインの良し悪しは `デザインの極意書.md` のチェックリストで判断する
- 勝手に大きく変えない。方針は必ずユーザーに確認する

## 動画制作フロー
1. 動画素材を `作業中動画/` に入れる
2. `/video-script` → テロップ・ナレーション・音声生成
3. `/telop-design` → bannnner.comからデザイン導出 → AdVideo.tsx実装
4. `public/` に素材コピー → `npm run render`

## 参照ファイル
| ファイル | 用途 |
|---------|------|
| `デザインの極意書.md` | デザイン判断基準 |
| `日本人デザイナーの哲学・思考・デザインタイプ一覧.md` | スタイル選択基準 |
| `バナー参考サイト.md` | テロップデザインの参考元 |

## Remotion
- 縦型 1080×1920 / 30fps
- AdVideo.tsx: クリップをSequenceで繋ぎ、テロップ+Audioを重ねる構成

## Notes
- スキルは `skills/` が実体、`~/.claude/skills/` はシンボリックリンク
- Paper MCP: `http://127.0.0.1:29979/mcp`（Paper Desktop起動必須）
