# ==============================================================================
# Makefile — プロジェクト共通タスクランナー
# 使い方: make <target>
# ==============================================================================

.DEFAULT_GOAL := help
.PHONY: help setup lint test build clean dev

# カラー定義
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RESET  := \033[0m

## -----------------------------------------------------------------------
## ℹ️  help: 利用可能なコマンドを一覧表示
## -----------------------------------------------------------------------
help:
	@echo ""
	@echo "$(GREEN)使い方: make <target>$(RESET)"
	@echo ""
	@grep -E '^##' Makefile | sed 's/## //' | column -t -s ':'
	@echo ""

## -----------------------------------------------------------------------
## 🛠  setup: 開発環境のセットアップ（初回のみ）
## -----------------------------------------------------------------------
setup:
	@echo "$(YELLOW)Setting up...$(RESET)"
	lefthook install
	@cp -n .env.example .env 2>/dev/null && echo "✅ .env を作成しました" || echo "ℹ️  .env は既に存在します"
	npm ci
	@echo "$(GREEN)Done!$(RESET)"

## 🔍 lint: 型チェック
lint:
	@echo "$(YELLOW)Type checking...$(RESET)"
	npx tsc --noEmit
	@echo "$(GREEN)Type check passed$(RESET)"

## 🏗  build: TypeScriptをビルド
build:
	@echo "$(YELLOW)Building...$(RESET)"
	npm run build
	@echo "$(GREEN)Build succeeded$(RESET)"

## 🚀 dev: 開発モードで起動（ts-node）
dev:
	npm run dev

## ▶️  start: ビルド済みのBotを起動
start:
	npm start

## 🧹 clean: ビルド成果物を削除
clean:
	@echo "$(YELLOW)Cleaning...$(RESET)"
	rm -rf dist
	@echo "$(GREEN)Cleaned$(RESET)"