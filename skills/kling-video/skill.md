---
name: kling-video
description: 作業中動画フォルダの画像を分析してKling（fal.ai経由）用のプロンプトを作成し、そのままfal.aiで動画生成まで実行する。Klingで動画作って、Kling用プロンプト、v2.1で生成、v3で生成、動画生成して、という場面で必ず使う。
allowed-tools: Bash(ls *), Read, Write, mcp__fal-ai__upload_file, mcp__fal-ai__generate_video_from_image
---

## Kling動画生成（fal.ai経由）

`作業中動画/` 内の画像を分析し、Kling image-to-videoに最適な英語プロンプトを生成してfal.aiで動画生成まで実行する。

---

### Step 1: 画像ファイルを確認する

```
ls /Users/keeee/Desktop/Dev/Paper/作業中動画/
```

画像ファイル（.png / .jpg / .jpeg / .webp）をリストアップする。0枚なら「作業中動画フォルダに画像が見つかりません」と伝えて終了。

---

### Step 2: 画像を読み込んで内容を把握する

すべての画像を Read ツールで読み込む。以下を把握する:

- **何が写っているか**（商品・人物・背景・小道具）
- **雰囲気・テイスト**（高級感/カジュアル/清潔感/可愛い等）
- **広告のターゲットと目的**（誰に何を伝えたい動画か）
- **登場する被写体の種類と数**（商品のみ / 人物のみ / 商品+人物）

---

### Step 3: 動画構成をユーザーと確認する

以下をまとめてユーザーに聞く:

1. **シーン数**: 何本のクリップを作るか（通常3本）
2. **各シーンのコンセプト**: どんな場面にするか（例: 商品クローズアップ / 人物×商品 / シネマティック）
3. **モデル選択**: 練習用（v2.1 std / $0.28/本）か本番（v3 pro / $1.40/本）か

**Klingの重要制約:**
- 1シーン＝1画像のみ入力（PixVerseのfusionのような複数画像合成は不可）
- 人物+商品を同時に出したい場合は、事前に合成した画像を用意するか、人物か商品かどちらか1枚を選ぶ

ユーザーの回答を受けてから Step 4 に進む。

---

### Step 4: プロンプトを生成する

#### Kling用プロンプト設計の基本方針

**参照画像ありき**: 視覚スタイルは参照画像が担う。プロンプトは「カメラワーク」「雰囲気」「光の演出」だけを指定する。

**英語で書く**: fal.aiへの入力は英語のみ。

**縦型動画**: aspect_ratio は常に `9:16`、duration は `5` 秒固定。

#### 動き指定の原則

**「状態」で指定し、カメラで動きを演出する**

AIは動詞を誇張する。`eat` → 大げさな一口、`reach out` → 突き動作になる。被写体は静止状態に保ち、カメラを動かして動きを演出する。

| 動詞指定（危険） | 状態指定（安全） |
|--------------|--------------|
| `eats the dessert` | `a fork resting lightly on the plate beside her` |
| `reaches for the product` | `her hand resting near the product` |
| `lifts the product` | `the product placed elegantly on the table` |
| `picks up` | `holding the item lightly between her fingers` |

**カメラワーク選択:**
- `slow push-in`（ゆっくり寄る・商品の魅力を引き出す）
- `slow pull-back`（ゆっくり引く・全体を見せる）
- `slowly orbits around`（旋回・シネマティック感）
- `gentle tilt down`（上から商品へ）

**negative_promptは必須:**
```
blur, distort, low quality, shaky
```
人物シーンには追加: `hand touching food, exaggerated movement`

#### プロンプトテンプレート

**商品のみ:**
```
[商品の状態・配置]. [光の演出]. [カメラワーク]. [雰囲気キーワード], 4K.
```

**人物のみ / 人物メイン:**
```
[人物の状態・ポーズ・表情]. [商品または小道具の配置（状態で）]. [カメラワーク]. [光・雰囲気], 4K.
```

---

### Step 5: プロンプト.mdに保存する

`/Users/keeee/Desktop/Dev/Paper/作業中動画/プロンプト.md` に書き出す（上書き）。

**出力フォーマット:**

```markdown
# [商品名] Klingプロンプト（fal.ai経由）

> 基本方針: 全シーンで参照画像を1枚入力。状態で指定し、カメラワークで動きを演出する。

---

## Scene 1 — [コンセプト名]（5秒）

**参照画像:** `[ファイル名]`
**モデル:** fal-ai/kling-video/[選択モデル]/image-to-video
**アスペクト比:** 9:16
**尺:** 5秒

**プロンプト（英語）**
```
[プロンプト本文]
```

**negative_prompt:** blur, distort, low quality, shaky[, 追加指定]

**動きの指示:** [日本語で1行の動き説明]

---

## Scene 2 — ...

（以下同様）
```

保存後、プロンプト内容をユーザーに提示し、**ここで必ず止まる**。

「プロンプトを保存しました。修正があればお知らせください。問題なければ「生成して」と言ってください。」と伝えて待機する。

---

### Step 6: 生成指示を受けてから進む

ユーザーから「生成して」「OK」「このまま進めて」などの明示的な指示を受けてから Step 7 に進む。

プロンプトの修正を求められた場合は `プロンプト.md` を編集して再度ユーザーに提示し、再度待機する。

確認が取れたら各シーンの参照画像を `mcp__fal-ai__upload_file` でアップロードする。

- 同じ画像を複数シーンで使う場合は1回だけアップロードしてURLを使い回す
- アップロード完了したURLを控えておく

---

### Step 7: fal.aiで動画生成を実行する

`mcp__fal-ai__generate_video_from_image` でシーンごとに生成する。

**モデルID:**
- 練習用: `fal-ai/kling-video/v2.1/standard/image-to-video`
- 本番: `fal-ai/kling-video/v3/pro/image-to-video`

**固定パラメータ:**
- aspect_ratio: `9:16`
- duration: `5`

複数シーンは並列実行する（同時に投げる）。

---

### Step 8: 生成動画を作業中動画フォルダに保存する

生成されたURLをBash（curl）でダウンロードする。

ファイル名規則: `scene[番号]_[コンセプト名]_kling_[モデル略称].mp4`

例:
- `scene1_商品フォーカス_kling_v2.1std.mp4`
- `scene1_商品フォーカス_kling_v3pro.mp4`

```bash
curl -sL "[生成URL]" -o "/Users/keeee/Desktop/Dev/Paper/作業中動画/[ファイル名].mp4"
```

保存完了後、生成した動画のファイル名・モデル・推定コストをまとめてユーザーに報告する。

---

### 注意点

- **fusionは使えない**: Kling（fal.ai）は1画像入力のみ。複数被写体を同時に出したい場合はユーザーに事前合成を促す。
- **@記法は不要**: PixVerseのfusion用構文。Klingには使わない。
- **状態で指定する**: AIは動詞を誇張する。カメラを動かして被写体は静止に近くする。
- **コスト確認**: v2.1 std = $0.056/sec（5秒=$0.28/本）、v3 pro = $0.28/sec（5秒=$1.40/本）。生成前にユーザーに確認する。
- **v2.6 standardはimage-to-videoが存在しない**: v2.6はProのみ対応（$0.07/sec）。必要なら別途確認。
