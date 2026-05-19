import type { KBChunk } from "./index";

export const PRODUCTION_KB: KBChunk[] = [
  {
    id: "production.timeline",
    title: "End-to-end production timeline",
    text:
      "A standard paperback moves through Manuscript Review (5-7 days) → Editing (2-3 weeks, scope-dependent) → Layout & Typesetting (7-10 days) → Cover Design (5-7 days) → Author Proof Round 1 (5 days) → Final Print-Ready Sign-off (3 days) → ISBN allocation (5 days) → Print + retail onboarding (7-10 days). Total: roughly 8-12 weeks from contract signing for an unblocked project. Delays usually trace to a pending author input.",
    keywords: [
      "timeline",
      "production",
      "stage",
      "status",
      "schedule",
      "progress",
      "manuscript",
      "editing",
      "layout",
      "cover",
      "design",
      "proof",
      "weeks",
      "delay",
      "delayed",
    ],
    categoryAffinity: ["Book Status & Production Updates"],
  },
  {
    id: "production.dashboard",
    title: "Tracking production progress",
    text:
      "Current production status is shown on Dashboard → Books → [Title] → Production. Each stage carries a status (Pending / In Progress / Awaiting Author / Done) and the owner (Editor / Designer / Production). Authors are emailed whenever a stage transitions to Awaiting Author so we don't lose round-trip time.",
    keywords: [
      "track",
      "tracking",
      "progress",
      "dashboard",
      "stage",
      "status",
      "production",
      "pending",
      "awaiting",
      "owner",
    ],
    categoryAffinity: ["Book Status & Production Updates"],
  },
  {
    id: "production.delays",
    title: "Why a project might be blocked",
    text:
      "The most common blockers are: pending author response on edits, missing cover-brief inputs, copyright permission not received for third-party content, or KYC/contract paperwork still in draft. If a stage has been Awaiting Author for over 5 working days, BookLeaf sends a reminder email. If an author believes a stage is blocked on our end, please raise a ticket with the book ID — we will escalate.",
    keywords: [
      "blocked",
      "block",
      "stuck",
      "delay",
      "delayed",
      "pending",
      "awaiting",
      "stalled",
      "escalate",
      "escalation",
      "reminder",
      "response",
    ],
    categoryAffinity: ["Book Status & Production Updates"],
  },
];
