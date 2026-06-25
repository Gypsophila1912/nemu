# ==============================================================================
# Makefile — プロジェクト共通タスクランナー
# 使い方: make <target>
# ==============================================================================

.DEFAULT_GOAL := help
.PHONY: help setup lint test build clean dev up down

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
	# npm の場合: npm ci
	# pip の場合: pip install -r requirements.txt
	@echo "$(GREEN)Done!$(RESET)"

## 🔍 lint: コードの静的解析
lint:
	@echo "$(YELLOW)Linting...$(RESET)"
	# 例: npx eslint .
	# 例: ruff check .
	# 例: golangci-lint run
	@echo "$(GREEN)Lint passed$(RESET)"

## 🧪 test: テスト実行
test:
	@echo "$(YELLOW)Testing...$(RESET)"
	# 例: npm test
	# 例: pytest
	# 例: go test ./...
	@echo "$(GREEN)Tests passed$(RESET)"

## 🏗  build: ビルド
build:
	@echo "$(YELLOW)Building...$(RESET)"
	# 例: npm run build
	# 例: go build ./...
	@echo "$(GREEN)Build succeeded$(RESET)"

## 🚀 dev: 開発サーバー起動
dev:
	# 例: npm run dev
	# 例: go run main.go

## 🧹 clean: ビルド成果物を削除
clean:
	@echo "$(YELLOW)Cleaning...$(RESET)"
	# 例: rm -rf dist node_modules
	@echo "$(GREEN)Cleaned$(RESET)"

## 🐳 up: Docker ローカル環境を起動
up:
	docker compose up -d
	@echo "$(GREEN)DB ready at localhost:5432$(RESET)"

## 🐳 down: Docker ローカル環境を停止
down:
	docker compose down