# PROJECT_NAME

<!-- バッジ（CIが通ったら自動で更新される） -->

[![CI](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 一言でプロジェクトを説明する

---

## 目次

- [概要](#概要)
- [開発環境のセットアップ](#開発環境のセットアップ)
- [使い方](#使い方)
- [開発フロー](#開発フロー)
- [ディレクトリ構成](#ディレクトリ構成)
- [コントリビュート](#コントリビュート)

---

## 概要

<!-- プロジェクトの目的・背景を書く -->

---

## 開発環境のセットアップ

---

## 使い方

---

## 開発フロー

```
main ← develop ← feature/xxx
                ← fix/xxx
```

1. `develop` から作業ブランチを切る（例: `feature/add-login`）
2. コミット → プッシュ → PR を `develop` に向けて作成
3. レビュー → マージ
4. リリース時に `develop` → `main` へマージ → `v*.*.*` タグを打つと自動リリース

---

## ディレクトリ構成

```
.
├── .github/
│   ├── ISSUE_TEMPLATE/     # Issue テンプレート
│   ├── workflows/          # GitHub Actions CI/CD
│   ├── CODEOWNERS          # 自動レビュワーアサイン
│   ├── dependabot.yml      # 依存関係の自動更新
│   └── PULL_REQUEST_TEMPLATE.md
├── flake.nix               # Nix 開発環境定義
├── Makefile                # タスクランナー
└── README.md
```

---

## コントリビュート

- イシューは [Issue テンプレート](.github/ISSUE_TEMPLATE/) を使って作成してください
- PRは [PRテンプレート](.github/PULL_REQUEST_TEMPLATE.md) に沿って記入してください
- ブランチ命名規則: `feature/`, `fix/`, `chore/`, `docs/`
- コミットメッセージ: [Conventional Commits](https://www.conventionalcommits.org/ja/) 準拠推奨

---

## クローン後に行うこと(任意)

Makefile の各コマンドに実際のコマンドを書く
flake.nix に使う言語のランタイムを追記
docker-compose.yml を使う構成に合わせて編集

---

## メモ

.editorconfig
「エディタの設定をチーム全員で統一する」 ファイル

.envrc
「そのフォルダに cd するだけで開発環境に自動で入れる」 ファイル

flake.nix
「開発環境をコードで定義する」 ファイル

lefthook.yml
「git操作の直前に自動でチェックを走らせる」 ファイル

Makefile
「プロジェクトのコマンドを統一する」 ファイル
