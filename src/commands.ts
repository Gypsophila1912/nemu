import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchKeywords, addKeyword, removeKeyword } from "./db";

// /list コマンド
export const listCommand = new SlashCommandBuilder()
  .setName("list")
  .setDescription("登録中のキーワード一覧を表示");

// /add コマンド
export const addCommand = new SlashCommandBuilder()
  .setName("add")
  .setDescription("キーワードを追加")
  .addStringOption((opt) =>
    opt.setName("word").setDescription("追加する単語").setRequired(true),
  )
  .addStringOption((opt) =>
    opt
      .setName("reaction")
      .setDescription(
        "リアクション絵文字（省略時は💤、サーバー絵文字はそのまま入力可）",
      )
      .setRequired(false),
  );

// /remove コマンド
export const removeCommand = new SlashCommandBuilder()
  .setName("remove")
  .setDescription("キーワードを削除")
  .addStringOption((opt) =>
    opt.setName("word").setDescription("削除する単語").setRequired(true),
  );

// カスタム絵文字 <:name:id> / <a:name:id> を message.react() に渡せる形に変換する
// カスタム絵文字は ID のみ取り出す。Unicode 絵文字はそのまま返す。
export function resolveReactionInput(input: string): string {
  const match = input.trim().match(/^<a?:\w+:(\d+)>$/);
  if (match) return match[1]; // カスタム絵文字 → ID のみ
  return input.trim(); // Unicode 絵文字
}

// /list が実行されたときの処理
export async function handleListCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  try {
    const keywords = await fetchKeywords();

    if (keywords.length === 0) {
      await interaction.editReply("キーワードが登録されていません。");
      return;
    }

    // reaction でグループ化
    const grouped = new Map<string, string[]>();
    for (const kw of keywords) {
      const words = grouped.get(kw.reaction) ?? [];
      words.push(kw.word);
      grouped.set(kw.reaction, words);
    }

    const sections = [...grouped.entries()].map(
      ([reaction, words]) =>
        `${reaction} **（${words.length}件）**\n${words.map((w) => `・${w}`).join("\n")}`,
    );

    const body = sections.join("\n\n");
    const header = `**登録中のキーワード（${keywords.length}件）**\n\n`;

    // Discord メッセージ上限 (2000文字) に収まるよう切り詰め
    const MAX = 2000 - header.length;
    const trimmed = body.length > MAX ? body.slice(0, MAX - 3) + "..." : body;

    await interaction.editReply(header + trimmed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "不明なエラー";
    await interaction.editReply(`エラー：${msg}`);
  }
}

// /add が実行されたときの処理
export async function handleAddCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  try {
    const word = interaction.options.getString("word", true);
    const rawReaction = interaction.options.getString("reaction") ?? "💤";
    const reaction = resolveReactionInput(rawReaction);

    await addKeyword(word, reaction);
    await interaction.editReply(`${reaction} 「${word}」を追加しました`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "不明なエラー";
    await interaction.editReply(`エラー：${msg}`);
  }
}

// /remove が実行されたときの処理
export async function handleRemoveCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  try {
    const word = interaction.options.getString("word", true);
    const deleted = await removeKeyword(word);

    if (deleted) {
      await interaction.editReply(`「${word}」を削除しました`);
    } else {
      await interaction.editReply(`「${word}」は登録されていません`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "不明なエラー";
    await interaction.editReply(`エラー：${msg}`);
  }
}
