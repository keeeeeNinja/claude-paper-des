# Paper デザイン完成プロジェクト

## WHY
途中まで作ったチラシ・広告・バナーを Paper MCP 経由で修正・補完し、作品として完成させる。

## WHAT
- **ツール**: Paper Desktop App + Paper MCP Server
- **MCP URL**: `http://127.0.0.1:29979/mcp`（Claude Code に登録済み）
- **参照ファイル**:
  - デザイン原則 → `デザインの極意書.md`
  - スタイル判断 → `日本人デザイナーの哲学・思考・デザインタイプ一覧.md`

## HOW

### 作業フロー
1. `get_basic_info` → `get_screenshot` で現状把握
2. `get_tree_summary` / `get_selection` で対象ノード特定
3. 修正方針をユーザーと確認してから実行
4. `set_text_content` / `update_styles` / `write_html` で修正
5. 2〜3操作ごとに `get_screenshot` でレビュー
6. 完了後 `finish_working_on_nodes` を呼ぶ

### 判断基準
- デザインの良し悪しは `デザインの極意書.md` のチェックリストで判断する
- スタイル選択に迷ったら `日本人デザイナーの哲学...md` を参照する
- 勝手に大きく変えない。方針は必ずユーザーに確認する

## Notes
- Paper Desktop が起動していないと MCP が動かない
- セッションが長くなると接続が切れる → Claude Code を再起動して再接続
- Claudeが期待と違う修正をした場合はここに追記する
