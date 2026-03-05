---
name: video-script
description: 作業中動画フォルダの動画を分析してショート動画用のテロップとナレーション原稿を生成する。フック・本題・行動喚起の3部構成。動画スクリプト、テロップ、ナレーション、ショート動画の原稿を作りたいときに使う。
allowed-tools: Bash(ffmpeg *), Bash(ffprobe *), Bash(ls *), Bash(conda *), Read, Write
disable-model-invocation: true
---

## 動画スクリプト生成

複数のクリップを繋いだ1本のショート動画用に、テロップとナレーション原稿を作成し、音声ファイルを生成する。

### 前提知識

- `作業中動画/` 内の `.mp4` ファイルは**すべて1本の動画を構成するクリップ**
- **テロップ**: クリップごとに1枚ずつ表示。クリップ数＝テロップ枚数
  - 1枚目 → フック／最後 → 行動喚起／それ以外 → 本題（複数可）
- **ナレーション**: 全クリップ合計時間に収まる1本の連続した原稿

---

### Step 1: 動画ファイルと合計尺を確認する

!`ls "/Users/keeee/Desktop/Dev/Paper/作業中動画/"*.mp4 2>/dev/null`

ファイルが0本なら「作業中動画フォルダに動画ファイルが見つかりませんでした」と伝えて終了する。

合計尺を計測する:

!`for f in "/Users/keeee/Desktop/Dev/Paper/作業中動画/"*.mp4; do ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$f" 2>/dev/null; done | awk '{sum+=$1} END {printf "合計: %.1f秒\n", sum}'`

合計尺（秒）を記憶する。

---

### Step 2: ナレーションのペースと話者を選ぶ

ユーザーに以下を**まとめて**聞く:

**① ナレーションのペースを選んでください:**
1. ゆっくり（落ち着いた・高級感）
2. 普通（自然な話し言葉）
3. 早口（テンポよく・エネルギッシュ）

**② TTSエンジンと話者を選んでください:**

**[A] Qwen3-TTS CustomVoice（英語名の話者）**

| 番号 | 話者名 | 性別 |
|------|--------|------|
| A1 | Ono_Anna | 女性 |
| A2 | Sohee | 女性 |
| A3 | Vivian | 女性 |
| A4 | Serena | 女性 |
| A5 | Ryan | 男性 |
| A6 | Aiden | 男性 |
| A7 | Uncle_Fu | 男性 |
| A8 | Dylan | 男性 |
| A9 | Eric | 男性 |

**[B] VOICEVOX（日本語キャラクター・要起動）**

| ID | キャラクター | スタイル |
|----|------------|---------|
| 8 | 春日部つむぎ | ノーマル（女性） |
| 10 | 雨晴はう | ノーマル（女性） |
| 46 | 小夜/SAYO | ノーマル（女性） |
| 13 | 青山龍星 | ノーマル（男性・低音） |
| 84 | 青山龍星 | しっとり（男性） |
| 30 | No.7 | アナウンス（男性） |

ユーザーの回答をもとに **ナレーション上限文字数** を決定する:
- ゆっくり → 合計秒数 × 3
- 普通     → 合計秒数 × 5
- 早口     → 合計秒数 × 7

---

### Step 3: 全クリップのフレームを抽出・分析する

各 `.mp4` ファイルに対して順番にBashで実行する（`VIDEO_PATH` を実際のパスに置き換え）:

```
mkdir -p /tmp/video-script-frames && ffmpeg -i "VIDEO_PATH" -vf "fps=1/5,scale=640:-1" /tmp/video-script-frames/frame-%03d.jpg -y 2>/dev/null && ls /tmp/video-script-frames/
```

抽出したフレームを Read ツールで読み込み、クリップの内容（商品・人物・シーン・雰囲気）を把握する。全クリップ分繰り返す。

---

### Step 4: スクリプト生成・保存

分析結果をもとにスクリプトを生成し、Bash で `/Users/keeee/Desktop/Dev/Paper/作業中動画/テロップとナレーション.md` に書き出す。

**出力フォーマット**:

```
# テロップ・ナレーション原稿

## テロップ（クリップごと）

| クリップ | 役割 | テロップ（15文字以内） |
|---------|------|----------------------|
| scene1_xxx | フック | （驚き・問いかけ） |
| scene2_xxx | 本題 | （根拠・解説の要点） |
| scene3_xxx | 行動喚起 | （保存・フォロー等） |

## ナレーション（全体通し・〇〇文字／上限〇〇文字）

（ここにナレーション本文）
```

**ナレーション作成の制約**:
- 文字数が **Step 2 で決めた上限を超えないこと**
- フックで興味を引き → 本題で価値を伝え → 行動喚起で締める流れ
- です/ます調、話し言葉で自然に
- 生成後、必ず文字数をカウントして上限内か確認する。超えていたら削って上限内に収める

保存後、「テロップとナレーション.md に保存しました（ナレーション〇〇文字／上限〇〇文字）」と伝える。

---

### Step 5: 音声を生成し、動画尺に収まるか確認する

Step 2 で選んだ話者と Step 4 のナレーション本文で音声を生成する。
生成後に実際の長さを測り、動画尺を超えていたらナレーションを縮めて再生成する（**最大3回**）。

#### 5-1. 音声を生成する

`NARRATION_TEXT` を実際の値に置き換え、選んだエンジンに応じてBashで実行:

**Qwen3-TTS CustomVoice（A系）の場合** - `SPEAKER_NAME` を置き換え:
```
conda run -n qwen3-tts-mlx python /Users/keeee/Desktop/Dev/Paper/scripts/generate_tts.py \
  --text "NARRATION_TEXT" \
  --speaker "SPEAKER_NAME" \
  --output "/Users/keeee/Desktop/Dev/Paper/作業中動画/narration.wav"
```

**VOICEVOX（B系）の場合** - `SPEAKER_ID` を置き換え:
```
python3 /Users/keeee/Desktop/Dev/Paper/scripts/generate_tts.py \
  --text "NARRATION_TEXT" \
  --voicevox-id SPEAKER_ID \
  --output "/Users/keeee/Desktop/Dev/Paper/作業中動画/narration.wav"
```

#### 5-2. 音声の長さを計測する

```
ffprobe -v quiet -show_entries format=duration -of csv=p=0 "/Users/keeee/Desktop/Dev/Paper/作業中動画/narration.wav"
```

#### 5-3. 動画尺と比較する

- **音声秒数 ≤ 動画合計秒数** → 完了。「narration.wav を生成しました（音声〇〇秒／動画〇〇秒）」と伝える
- **音声秒数 > 動画合計秒数** → 以下の手順でナレーションを縮めて 5-1 からやり直す:
  1. 新目標文字数 = `floor(現在の文字数 × 動画秒数 / 音声秒数 × 0.9)`
  2. ナレーション本文を新目標文字数以内に縮める（流れ・です/ます調を維持しつつ削る）
  3. `テロップとナレーション.md` のナレーション行を更新する
  4. 縮めたテキストで 5-1 を再実行 → 5-2 → 5-3 を繰り返す
- 3回試しても収まらない場合は現状を報告してユーザーに確認する

---

### 注意点
- テロップは15文字以内を目安に短く端的に
- クリップ数が変わっても本題のテロップ枚数で吸収する
- 動画の内容・ジャンルと整合性のある原稿にする
