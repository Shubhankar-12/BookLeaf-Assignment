import type { KBChunk } from "./index";

export const PRINTING_KB: KBChunk[] = [
  {
    id: "printing.quality-policy",
    title: "Print quality complaints",
    text:
      "BookLeaf print runs follow a 100% sample-check policy for proofs and a 5% random check for subsequent runs. If an author or reader receives a copy with binding defects, missing pages, color drift greater than the agreed Pantone tolerance, or smudging, please raise a ticket with clear photographs of the defect, the visible barcode/ISBN, and the courier waybill (where available). Replacement is at no cost when the defect is confirmed.",
    keywords: [
      "print",
      "printing",
      "quality",
      "damaged",
      "binding",
      "pages",
      "missing",
      "color",
      "smudge",
      "smudging",
      "defect",
      "replacement",
      "reprint",
    ],
    categoryAffinity: ["Printing & Quality"],
  },
  {
    id: "printing.proof-copy",
    title: "Proof / author copy",
    text:
      "Every paid title includes 1 free proof copy shipped to the registered author address before the print run is committed. Authors must approve the proof within 7 days or it auto-approves. Additional author copies are billed at production cost plus shipping; orders are placed from Dashboard → Books → [Title] → Order Copies.",
    keywords: [
      "proof",
      "author copy",
      "copies",
      "free",
      "approve",
      "approval",
      "order",
      "ship",
      "shipping",
    ],
    categoryAffinity: ["Printing & Quality"],
  },
];
