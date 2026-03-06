---
name: pixverse-prompt
description: 作業中動画フォルダの画像を分析してPixVerse動画生成用のプロンプトを作成し、プロンプト.mdに保存する。PixVerseで動画を作りたい、プロンプトを作って、動画生成して、Image to Video / Fusion Videoのプロンプトが欲しい、という場面で必ず使う。画像があれば迷わずこのスキルを起動すること。
allowed-tools: Bash(ls *), Read, Write
---

## PixVerseプロンプト生成

`作業中動画/` 内の画像を分析し、PixVerseのImage to Video / Fusion Videoに最適な英語プロンプトを生成して `プロンプト.md` に保存する。

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
2. **各シーンのコンセプト**: どんな場面にするか（例: 商品クローズアップ / 人物が使用 / シネマティック）
3. **尺**: 1クリップ何秒か（PixVerseは5秒 or 8秒のみ）

ユーザーの回答を受けてから Step 4 に進む。

---

### Step 4: シーンごとのPixVerseモードを決定する

各シーンに登場する被写体の数で使用ツールを決める:

| 登場被写体 | 使用ツール | 制約 |
|-----------|-----------|------|
| 1種類のみ（商品だけ or 人物だけ） | `image_to_video` | v5・最大1080p・8秒OK |
| 2種類以上（商品＋人物など） | `fusion_video` | v4.5のみ・8秒なら最大720p |

**fusion_videoの注意:**
- v4.5のみ対応（v5は使えない）
- 1080p × 8秒は不可 → 720p × 8秒 または 1080p × 5秒を使う
- 最大3枚の参照画像
- プロンプト内で `@ref_name` 構文を使う（例: `@woman`, `@product`）

---

### Step 5: プロンプトを生成する

#### プロンプト作成の基本方針

**参照画像ありき**: 視覚的なスタイルは参照画像から来る。プロンプトは「動き」と「カメラ」と「雰囲気」だけを指定する。見た目の詳細を説明しすぎない。

**英語で書く**: PixVerseへの入力は英語のみ。

**縦型動画**: aspect_ratio は常に `9:16`。

#### 動き指定の本質的なルール

**AIは「動詞」を誇張する**

PixVerseのAIは動作を「わかりやすく見せる」ために最大化する傾向がある。`eat`と書けば大げさな一口に、`reach out`と書けば突き動作に、`lift`と書けば高く持ち上げてこぼすことになる。AIは「なぜその動きをするか（目的）」を理解せず、「どう動くか（アクション）」だけを最大化する。

**物体間の接触は特に不安定**

人と物が触れる・動かす・持つ場面は、AIが物理的整合性を保てないことが多い。食べる・つかむ・押すなど接触を伴う動詞は予測不能な挙動を引き起こしやすい。

**原則：「動詞（プロセス）」ではなく「状態（結果）」を指定する**

| 動詞指定（危険） | 状態指定（安全） |
|--------------|--------------|
| `eats the dessert` | `a fork resting lightly on the plate beside her` |
| `reaches out her hand` | `her hand resting gently near the glass` |
| `lifts the product` | `the product placed elegantly on the table` |
| `takes a bite` | `closes her eyes with a blissful expression, fork in hand` |
| `picks up` | `holding the item lightly between her fingers` |

**動きが必要な場合の修飾ルール**

どうしても動きを入れたい場合は、必ず以下のすべてを付ける:
- 速さ: `slowly`, `gently`, `subtly`
- 大きさ: `tiny`, `small`, `slight`
- 抑制: `No exaggerated movements`, `subtle and refined`
- 具体的な終着状態: どこまで動くかを明示する

**カメラを動かして被写体を静止させる**

被写体を大きく動かすより、カメラワークで動きを演出する方が安定する。`slow push-in`, `gently orbits`, `slowly pulls back` などカメラの動きをメインにし、被写体はできるだけ静止状態に近くする。

**カメラワーク:**
- `slow push-in`（ゆっくり寄る・商品の魅力を引き出す）
- `slow pull-back`（ゆっくり引く・全体を見せる）
- `slowly orbits around`（旋回・シネマティック感）
- `gentle tilt down`（上から商品へ）

#### プロンプトテンプレート

**image_to_video（商品のみ）:**
```
[商品の状態・動き]. [カメラワーク]. [光の演出]. [雰囲気キーワード]. [品質指定]
```
例:
```
A silver spoon slowly cuts into the center of the chocolate fondant. Rich molten chocolate flows out in a glossy stream. Gentle steam rises. Extreme close-up, slow motion. Dramatic spotlight from above. Cinematic, 4K, dark luxurious atmosphere.
```

**fusion_video（人物＋商品）:**
```
@[人物ref] [動き・状態]. [商品ref] on [場所]. [雰囲気]. No exaggerated movements. [カメラワーク]. [品質指定].
```
例:
```
@woman sits gracefully at a candlelit cafe table. A small @product on a white plate before her. She gazes at it with a soft smile, hands resting on her lap. No exaggerated movements. Camera slowly pulls back. Warm candlelight, cinematic, 4K.
```

---

### Step 6: プロンプト.mdに保存する

`/Users/keeee/Desktop/Dev/Paper/作業中動画/プロンプト.md` に書き出す。

**出力フォーマット:**

```markdown
# [商品名] PixVerseプロンプト

> 基本方針: 全シーンで参照画像を入力し、動きとカメラだけをプロンプトで指定する。

---

## Scene 1 — [コンセプト名]（[尺]秒）

**参照画像:** `[ファイル名]`
**PixVerseモード:** image_to_video / fusion_video
**アスペクト比:** 9:16
**品質:** 720p（fusion_video）または 1080p（image_to_video）

**プロンプト（英語）**
```
[プロンプト本文]
```

**動きの指示:** [日本語で1行の動き説明]

---

## Scene 2 — ...

（以下同様）

---

## PixVerse投げ方メモ
- Image to Video / Fusion Video モードで参照画像を入力
- 上記プロンプトをそのままコピペ
- 尺・アスペクト比を設定
- fusion_videoは参照画像に ref_name を設定してプロンプトの @ref_name と対応させる
```

保存後、プロンプトの内容を表示してユーザーに確認を求める。

---

### 注意点

- **動詞より状態で指定する**: AIは動詞を誇張する。「食べる」より「フォークを軽く持っている」、「手を伸ばす」より「手がテーブルの上にある」という状態の記述が安全。
- **接触を最小化する**: 人と物が触れる場面は予測不能。接触させる場合は状態・速さ・大きさ・終着点をすべて指定し `No exaggerated movements` を付ける。
- **カメラで動きを演出する**: 被写体を静止に近い状態にしてカメラを動かすと安定した映像になる。
- **プロンプトは絞る**: 視覚スタイルは参照画像が担う。プロンプトは状態・カメラ・雰囲気のみ指定する。
- **fusion_videoの制限**: v4.5のみ対応。8秒なら720p、1080pなら5秒まで。
