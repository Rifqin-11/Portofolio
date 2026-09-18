const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

type GeminiPart = {
  text?: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
  error?: {
    message?: string;
  };
};

const getGeminiConfig = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  const model =
    (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim() ||
    DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY belum dikonfigurasi.");
  }

  return { apiKey, model };
};

const generateText = async (prompt: string): Promise<string> => {
  const { apiKey, model } = getGeminiConfig();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 800,
        },
      }),
    },
  );

  const result = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(result.error?.message || "Gemini gagal memproses teks.");
  }

  const text = result.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) throw new Error("Gemini tidak mengembalikan teks.");
  return text;
};

const baseInstruction = (draft: string, instruction: string) => `
You are editing content for a developer portfolio. Rewrite the user's draft so it is clear, natural, concise, and professional. Preserve the facts and intent. Do not invent names, dates, technologies, metrics, or achievements. The user may explain their idea in Indonesian; translate it into polished English suitable for the public portfolio. Do not add an introduction, explanation, quotation marks, or markdown.

User's extra instruction:
${instruction.trim() || "Improve the wording while keeping the original meaning."}

Draft:
${draft.trim()}
`;

export const rewritePortfolioText = (draft: string, instruction = "") =>
  generateText(baseInstruction(draft, instruction));

export const rewriteResponsibilities = async (
  draft: string,
  instruction = "",
) => {
  const result = await generateText(`
${baseInstruction(draft, instruction)}
Rewrite this as a short list of concrete responsibilities. Return only the responsibilities, exactly one item per line, with no bullets, numbering, markdown, or blank lines. Keep at most 3 items because the portfolio displays at most 3 responsibilities.
`);

  return result
    .split("\n")
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3)
    .join("\n");
};
