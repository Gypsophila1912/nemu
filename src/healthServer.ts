import http from "http";

const PORT = process.env.PORT ?? "8000";
const HEALTH_CHECK_URL =
  process.env.HEALTH_CHECK_URL ?? `http://localhost:${PORT}`;

// ============================================================
// ヘルスチェックサーバー
//
// KoyebはHTTPでアプリの死活確認をする。
// Discord BotはWebサーバーじゃないので自前でHTTPサーバーを立てる必要がある。
// ============================================================
export function startHealthServer(): void {
  http
    .createServer((_, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
      );
    })
    .listen(PORT, () => {
      console.log(`🌐 ヘルスチェックサーバー起動: port ${PORT}`);
    });

  // ============================================================
  // スリープ防止
  //
  // Koyebの無料プランは1時間リクエストがないとスリープする。
  // 自分自身に10分ごとにリクエストを送ることでスリープを防ぐ。
  // ============================================================
  setInterval(
    async () => {
      try {
        await fetch(HEALTH_CHECK_URL);
        console.log(`💓 ヘルスチェック OK`);
      } catch (e) {
        console.error("❌ ヘルスチェック失敗:", e);
      }
    },
    10 * 60 * 1000,
  ); // 10分 = 10 * 60秒 * 1000ミリ秒

  console.log(`🔁 スリープ防止開始: ${HEALTH_CHECK_URL} (10分間隔)`);
}
