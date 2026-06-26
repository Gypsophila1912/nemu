import { REST, Routes } from "discord.js";

import { createBot } from "./bot";
import { listCommand, addCommand, removeCommand } from "./commands";

// 環境変数チェック
const REQUIRED_ENV = [
  "DISCORD_TOKEN",
  "DISCORD_CLIENT_ID",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
] as const;
// 設定されていなければエラーを返す
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(`環境変数${key}が設定されていません`);
  }
}
// envから環境変数取得
const TOKEN = process.env.DISCORD_TOKEN!;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

// スラッシュコマンドの登録
async function registerCommands(): Promise<void> {
  const rest = new REST().setToken(TOKEN);

  console.log("コマンド登録中...");

  await rest.put(Routes.applicationCommands(CLIENT_ID), {
    body: [listCommand.toJSON(), addCommand.toJSON(), removeCommand.toJSON()],
  });

  console.log("登録完了");
}

// 起動処理
async function main(): Promise<void> {
  await registerCommands();

  const bot = createBot();
  await bot.login(TOKEN);
}

main().catch((err) => {
  console.error("起動エラー", err);
  process.exit(1);
});
