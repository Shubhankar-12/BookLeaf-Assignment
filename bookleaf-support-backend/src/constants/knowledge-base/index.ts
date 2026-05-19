import type { TicketCategory } from "../ticket";

import { ROYALTY_KB } from "./royalty";
import { ISBN_KB } from "./isbn";
import { PRINTING_KB } from "./printing";
import { DISTRIBUTION_KB } from "./distribution";
import { PRODUCTION_KB } from "./production";
import { TONE_KB } from "./tone";

// `categoryAffinity` is a soft scoring boost; tone chunks omit it because they apply globally.
export interface KBChunk {
  id: string;
  title: string;
  text: string;
  keywords: string[];
  categoryAffinity?: TicketCategory[];
}

export const TOPIC_KB: KBChunk[] = [
  ...ROYALTY_KB,
  ...ISBN_KB,
  ...PRINTING_KB,
  ...DISTRIBUTION_KB,
  ...PRODUCTION_KB,
];

// Always injected into draft prompts only — never into classify/priority (wastes tokens).
export { TONE_KB };

export const ALL_KB: KBChunk[] = [...TOPIC_KB, ...TONE_KB];

export {
  ROYALTY_KB,
  ISBN_KB,
  PRINTING_KB,
  DISTRIBUTION_KB,
  PRODUCTION_KB,
};
