# Paper 制作プロジェクト

## WHY
チラシ・バナー・広告などの**静止画デザイン**と、ショート動画広告の**動画制作**の両方を扱うプロジェクト。
- 静止画 → Paper MCP 経由で修正・完成させる
- 動画 → Remotion + VOICEVOX で自動生成する

## プロジェクト構成

```
Paper/
├── 作業中動画/         # 制作中のクリップ（.mp4）＋テロップとナレーション.md＋narration.wav
├── public/             # Remotion用アセット（動画・音声）
├── src/
│   └── compositions/
│       └── AdVideo.tsx # Remotionコンポジション（動画＋テロップ＋音声）
├── skills/
│   └── video-script/   # スキル本体（~/.claude/skillsへシンボリックリンク）
├── scripts/
│   └── generate_tts.py # VOICEVOX音声生成スクリプト
├── TODO.md             # 今後やること
└── CLAUDE.md           # このファイル
```

---

## 静止画デザイン（Paper MCP）

- **ツール**: Paper Desktop App + Paper MCP Server
- **MCP URL**: `http://127.0.0.1:29979/mcp`（Claude Code に登録済み）
- Paper Desktop が起動していないと MCP が動かない
- セッションが長くなると接続が切れる → Claude Code を再起動して再接続

### 作業フロー
1. `get_basic_info` → `get_screenshot` で現状把握
2. `get_tree_summary` / `get_selection` で対象ノード特定
3. 修正方針をユーザーと確認してから実行
4. `set_text_content` / `update_styles` / `write_html` で修正
5. 2〜3操作ごとに `get_screenshot` でレビュー
6. 完了後 `finish_working_on_nodes` を呼ぶ

### 判断基準
- デザインの良し悪しは `デザインの極意書.md` のチェックリストで判断する
- スタイル選択に迷ったら `日本人デザイナーの哲学・思考・デザインタイプ一覧.md` を参照する
- 勝手に大きく変えない。方針は必ずユーザーに確認する

---

## 動画制作（Remotion + VOICEVOX）

### スキル: `/video-script`
`作業中動画/` の動画クリップを分析してショート動画の原稿・音声を生成する。

**フロー:**
1. 動画ファイルを自動検出・合計尺を計測
2. ナレーションのペース（ゆっくり/普通/早口）と話者を選ぶ
3. 動画フレームを抽出・分析
4. テロップ＋ナレーション原稿を生成 → 確認・修正 → `テロップとナレーション.md` に保存
5. VOICEVOXで音声生成 → 動画尺と比較 → 長すぎたら自動縮小・短すぎたらユーザー確認

**話者選択（VOICEVOX・5スタイル×男女3名）:** 普通 / しっとり / アナウンス / シリアス / 明るい

### Remotion
- 起動: `npm run studio` → http://localhost:3000
- レンダー: `npm run render`
- コンポジション: 縦型 1080×1920 / 30fps
- `AdVideo.tsx`: クリップをSequenceで繋ぎ、テロップ＋Audioを重ねる構成

### VOICEVOX
- GUIアプリ起動が必須（起動するとlocalhost:50021でAPIが立ち上がる）
- 初回起動時にGatekeeperでブロックされたら:
  ```bash
  xattr -d com.apple.quarantine /Applications/VOICEVOX.app
  ```
- 音声生成: `python3 scripts/generate_tts.py --text "..." --voicevox-id 10 --output narration.wav`

---

## 参照ファイル
| ファイル | 用途 |
|---------|------|
| `デザインの極意書.md` | 静止画デザインの判断基準 |
| `日本人デザイナーの哲学・思考・デザインタイプ一覧.md` | スタイル選択の基準 |
| `ショート動画のプロ一覧.md` | テロップデザインの参考 |
| `テキストエフェクトチュートリアル.md` | テロップアニメーションの参考 |

## Notes
- スキルは `skills/video-script/` が実体、`~/.claude/skills/video-script` はシンボリックリンク
- スキルを変更したらこのリポジトリでコミット・プッシュするだけでOK
- TODO.md に次回やることを記載済み
