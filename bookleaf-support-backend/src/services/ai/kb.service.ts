import { TOPIC_KB, TONE_KB } from "../../constants/knowledge-base";
import type { KBChunk } from "../../constants/knowledge-base";
import { DEFAULT_AI_FALLBACK } from "../../constants/ticket";

export interface ChooseChunksArgs {
  subject: string;
  description: string;
  // Tone chunk only useful for draft prompts; wastes tokens on classify/priority.
  includeTone?: boolean;
}

const MAX_TOPIC_CHUNKS = 2;

const CATEGORY_AFFINITY_BOOST = 0.5;

// Keywords are hand-curated with both singular and plural forms — no stemming needed.
const normalize = (s: string): string => s.toLowerCase();

export const chooseChunks = ({
  subject,
  description,
  includeTone = false,
}: ChooseChunksArgs): KBChunk[] => {
  const haystack = normalize(`${subject} ${description}`);

  const scored = TOPIC_KB.map((chunk) => {
    let score = 0;
    for (const kw of chunk.keywords) {
      if (haystack.includes(normalize(kw))) score += 1;
    }
    // Gentle boost — classifier hasn't run yet, just break ties between equal-overlap chunks.
    if (
      chunk.categoryAffinity &&
      chunk.categoryAffinity.length > 0 &&
      score > 0
    ) {
      score += CATEGORY_AFFINITY_BOOST;
    }
    return { chunk, score };
  });

  const matched = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_TOPIC_CHUNKS)
    .map((s) => s.chunk);

  // Fallback to default-category affinity chunks if no keyword match.
  const topic =
    matched.length > 0
      ? matched
      : TOPIC_KB.filter((c) =>
          c.categoryAffinity?.includes(DEFAULT_AI_FALLBACK.category),
        ).slice(0, MAX_TOPIC_CHUNKS);

  if (!includeTone) return topic;

  const tone = TONE_KB[0];
  return tone ? [...topic, tone] : topic;
};
