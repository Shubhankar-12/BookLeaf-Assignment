import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "../../constants/ticket";
import type { KBChunk } from "../../constants/knowledge-base";
import type { SenderType } from "../../db/message";

export interface BuiltPrompt {
  system: string;
  user: string;
}

export interface ClassifyTicketInput {
  subject: string;
  description: string;
}

export interface PriorityTicketInput {
  subject: string;
  description: string;
}

export interface RecentMessage {
  senderType: SenderType;
  body: string;
}

export interface DraftPromptInput {
  subject: string;
  description: string;
  recentMessages: RecentMessage[];
  kbChunks: KBChunk[];
}

const CATEGORY_LIST = TICKET_CATEGORIES.map((c) => `- ${c}`).join("\n");

export const buildClassifyPrompt = ({
  subject,
  description,
}: ClassifyTicketInput): BuiltPrompt => {
  const system =
    `You classify BookLeaf author support tickets into exactly ONE of these categories:\n` +
    `${CATEGORY_LIST}\n\n` +
    `Respond ONLY with valid JSON of the form:\n` +
    `{ "category": "<one of the above, verbatim>", "confidence": <number between 0 and 1> }\n\n` +
    `Pick the single best fit. If the ticket is ambiguous or off-topic, return "General Inquiry" with a low confidence.`;

  const user = `Subject: ${subject}\n\nDescription: ${description}`;

  return { system, user };
};

export const buildPriorityPrompt = ({
  subject,
  description,
}: PriorityTicketInput): BuiltPrompt => {
  const allowed = TICKET_PRIORITIES.join("|");

  const system =
    `You assign a priority to BookLeaf author support tickets. Use exactly one of: ${TICKET_PRIORITIES.join(
      ", ",
    )}.\n\n` +
    `Guidance (BookLeaf policy — apply STRICTLY):\n` +
    `- CRITICAL: legal/regulatory exposure, public reputation risk, blocked launch, royalty unpaid > 3 months, ` +
    `OR ANY ISBN/metadata defect on a live retailer (wrong ISBN on Amazon/Flipkart, duplicate ISBN, ISBN mismatch with title or author). ` +
    `ISBN errors cost the author distribution and royalty — escalate to CRITICAL even if the author sounds calm.\n` +
    `- HIGH: direct financial impact, royalty delayed > 30 days, repeated escalations, distribution down > 7 days, ` +
    `book unavailable on a major retailer, print-quality complaint with photo evidence affecting multiple copies.\n` +
    `- MEDIUM: single-issue inquiry with a clear resolution path (most tickets) — print quality on a single copy, ` +
    `metadata edit request (blurb / cover / keywords), routine production-status question.\n` +
    `- LOW: informational, FAQ-style, no blocking impact (royalty cycle explanation, dashboard usage, policy questions).\n\n` +
    `Respond ONLY with valid JSON of the form:\n` +
    `{ "priority": "<${allowed}>", "confidence": <number between 0 and 1> }`;

  const user = `Subject: ${subject}\n\nDescription: ${description}`;

  return { system, user };
};

const formatRecentMessages = (messages: RecentMessage[]): string => {
  if (messages.length === 0) return "(no replies yet)";
  return messages
    .map((m) => `[${m.senderType}] ${m.body}`)
    .join("\n");
};

const formatKbContext = (chunks: KBChunk[]): string => {
  if (chunks.length === 0) return "(no grounded context available)";
  return chunks.map((c) => `- ${c.title}: ${c.text}`).join("\n\n");
};

export const buildDraftPrompt = ({
  subject,
  description,
  recentMessages,
  kbChunks,
}: DraftPromptInput): BuiltPrompt => {
  const system =
    `You draft empathetic, professional reply DRAFTS for BookLeaf admin agents. The admin reviews and edits before sending. ` +
    `Keep the draft under 200 words. Acknowledge the issue first. Be specific about next steps and owners. ` +
    `Reference the knowledge base only when it is directly relevant. Never invent policies. ` +
    `Never promise dates we cannot guarantee. Do NOT use phrases like "As an AI" or "I am a language model".\n\n` +
    `Knowledge base context (cite only when grounded):\n${formatKbContext(kbChunks)}`;

  const user =
    `Author ticket:\n` +
    `Subject: ${subject}\n` +
    `Description: ${description}\n\n` +
    `Recent conversation (oldest first):\n${formatRecentMessages(recentMessages)}\n\n` +
    `Write a single reply draft. No preamble, no sign-off boilerplate beyond a single line.`;

  return { system, user };
};
