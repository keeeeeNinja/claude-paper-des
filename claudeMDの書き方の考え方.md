🛠 製作者Boris氏による「CLAUDE.md」運用の極意
製作者チームは、CLAUDE.mdを単なる設定ファイルではなく、**「AIと共に成長させる生きたドキュメント（Compounding Engineering）」**として扱っています。

1. 「失敗」を即座にメモする（最強の学習ループ）
もっとも重要なルールです。Claudeが何か間違った出力をしたり、期待しない挙動をしたりした瞬間、「次からはこうして」という指示をその場でCLAUDE.mdに書き込みます。

チーム全員が週に何度もこのファイルに貢献（コミット）します。

PR（プルリクエスト）の際にも、新しいルールをCLAUDE.mdに加えることが推奨されています。

2. 「WHY / WHAT / HOW」の3層構造
Boris氏や周辺のエンジニアが推奨する構成は、非常にシンプルです。

WHY: プロジェクトの目的、対象ユーザー。

WHAT: 使用している技術スタック、ディレクトリ構造。

HOW: 開発コマンド（ビルド、テスト、リント）、特定のコーディング規約。

3. 「Less is More」（短ければ短いほど良い）
目安は100行未満（理想は60行以内）。

情報を詰め込みすぎると、Claudeの「注意（アテンション）」が分散し、重要な指示を無視する確率が上がります。

普遍的で、1年経っても変わらないような本質的なルールだけを厳選して載せます。

4. 詳細な指示は「別ファイル」に逃がす
CLAUDE.mdを肥大化させないためのテクニックです。

特定のモジュールや複雑な規約については、.claude/rules/*.md のように別ファイルを作成します。

CLAUDE.md内には「〇〇については rules/style.md を参照せよ」というインデックスだけを書き、Claudeに必要な時だけ読みに行かせます（Progressive Disclosure / 段階的開示）。

📝 推奨されるファイル構成の例
彼らのスタイルに基づいた、標準的なCLAUDE.mdの構成例です。
# [Project Name]

## Context
- 1-2 sentence description of the project purpose.

## Tech Stack
- Frontend: Next.js, Tailwind
- Backend: Cloudflare Workers
- Tools: Biome (Lint/Format), Vitest (Test)

## Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
- Type Check: `npm run type-check`

## Guidelines & Anti-patterns
- Use functional components and hooks.
- NEVER use 'any' type.
- Prefer named exports over default exports.
- Follow the directory structure: `src/features/[feature_name]/...`

## Notes
- [Project specific gotchas/warnings here]