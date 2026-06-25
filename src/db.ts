import { createClient } from "@supabase/supabase-js";

// スパベースクライアントの初期化
const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_ANON_KEY ?? "",
);

export type Keyword = {
  word: string;
  reaction: string;
};

// キーワード全件取得
export async function fetchKeywords(): Promise<Keyword[]> {
  const { data, error } = await supabase
    .from("sleepy_keywords")
    .select("word, reaction")
    .order("id");

  if (error) throw new Error(`キーワード取得失敗：${error.message}`);

  return (data ?? []) as Keyword[];
}

// キーワードを追加（reaction 省略時は 💤）
export async function addKeyword(
  word: string,
  reaction: string = "💤",
): Promise<void> {
  const { error } = await supabase
    .from("sleepy_keywords")
    .insert({ word, reaction });

  if (error) {
    if (error.code === "23505")
      throw new Error(`「${word}」はすでに登録されています`);
    throw new Error(`追加失敗：${error.message}`);
  }
}

// キーワードを削除
export async function removeKeyword(word: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("sleepy_keywords")
    .delete()
    .eq("word", word)
    .select();

  if (error) throw new Error(`削除失敗：${error.message}`);

  return (data ?? []).length > 0;
}
