# Paper ショート動画制作プロジェクト

## WHY
商品・サービスのショート動画広告を自動生成する。
動画クリップの分析からテロップ・ナレーション原稿生成・音声合成・Remotion組み込みまでを一気通貫で行う。

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

## スキル: `/video-script`

`作業中動画/` の動画クリップを分析してショート動画の原稿・音声を生成する。

### フロー
1. 動画ファイルを自動検出・合計尺を計測
2. ナレーションのペース（ゆっくり/普通/早口）と話者を選ぶ
3. 動画フレームを抽出・分析
4. テロップ（クリップごと）＋ナレーション原稿を生成 → 確認ステップ → `テロップとナレーション.md` に保存
5. VOICEVOXで音声生成 → 動画尺と比較 → 長すぎたら自動縮小・短すぎたらユーザー確認

### 話者選択（VOICEVOX・5スタイル×男女3名）
- 普通 / しっとり / アナウンス / シリアス / 明るい

## Remotion

- 起動: `npm run studio` → http://localhost:3000
- レンダー: `npm run render`
- コンポジション: 縦型 1080×1920 / 30fps
- `AdVideo.tsx`: クリップをSequenceで繋ぎ、テロップ＋Audioを重ねる構成

## VOICEVOX

- GUIアプリ起動が必須（起動するとlocalhost:50021でAPIが立ち上がる）
- 初回起動時にGatekeeperでブロックされたら:
  ```bash
  xattr -d com.apple.quarantine /Applications/VOICEVOX.app
  ```
- 音声生成: `python3 scripts/generate_tts.py --text "..." --voicevox-id 10 --output narration.wav`

## 参照ファイル
- テロップデザイン → `ショート動画のプロ一覧.md`
- テキストエフェクト → `テキストエフェクトチュートリアル.md`
- デザイン原則 → `デザインの極意書.md`

## Notes
- スキルは `skills/video-script/` が実体、`~/.claude/skills/video-script` はシンボリックリンク
- スキルを変更したらこのリポジトリでコミット・プッシュするだけでOK
- TODO.md に次回やることを記載済み
