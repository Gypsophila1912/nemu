import {
  Client,
  GatewayIntentBits,
  Message,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { fetchKeywords } from "./db";
import {
  handleListCommand,
  handleAddCommand,
  handleRemoveCommand,
} from "./commands";

// チャンネルの取得
function getTargetChannels(): string[] {
  return (process.env.TARGET_CHANNELS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function isTargetChannel(channel: TextChannel | ThreadChannel): boolean {
  const targets = getTargetChannels();
  if (targets.length === 0) {
    return false;
  }
  return targets.some((t) => t === channel.id || t === channel.name);
}

// メッセージに一致したキーワードのリアクション絵文字を全て返す（重複なし）
async function getSleepyReactions(content: string): Promise<string[]> {
  const keywords = await fetchKeywords();
  const lower = content.toLowerCase();

  const reactions = new Set<string>();
  for (const kw of keywords) {
    if (lower.includes(kw.word.toLowerCase())) {
      reactions.add(kw.reaction);
    }
  }
  return [...reactions];
}

// ディスコクライアントの作成・イベント登録
export function createBot(): Client {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  // clientReadyイベント(起動時に1回のみ発火)
  client.once("clientReady", () => {
    const targets = getTargetChannels();
    console.log(`Bot起動完了：${client.user?.tag}`);
    console.log(
      `監視チャンネル：${targets.length > 0 ? targets.join(",") : "未設定"}`,
    );
  });

  // messageCreateイベント(メッセージ送るたびに発火)
  client.on("messageCreate", async (message: Message) => {
    // botとテキストチャンネル以外は無視
    if (message.author.bot) return;
    if (!message.channel.isTextBased()) return;

    const channel = message.channel;

    const parent = channel.isThread() ? channel.parent : null;
    const inTarget =
      isTargetChannel(channel as TextChannel | ThreadChannel) ||
      (parent != null &&
        isTargetChannel(parent as TextChannel | ThreadChannel));

    if (!inTarget) return;

    try {
      const reactions = await getSleepyReactions(message.content);
      if (reactions.length > 0) {
        for (const reaction of reactions) {
          await message.react(reaction);
        }
        console.log(
          `[${channel.id}] ${message.author.tag} (${reactions.join(", ")}): ${message.content}`,
        );
      }
    } catch (err) {
      console.error("メッセージ処理エラー", err);
    }
  });

  // interactionCreateイベント(/コマンドが使われたとき)
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
      case "list":
        await handleListCommand(interaction);
        break;
      case "add":
        await handleAddCommand(interaction);
        break;
      case "remove":
        await handleRemoveCommand(interaction);
        break;
    }
  });

  return client;
}
