import type { KBChunk } from "./index";

export const ROYALTY_KB: KBChunk[] = [
  {
    id: "royalty.payment-cycle",
    title: "Royalty payment cycle",
    text:
      "BookLeaf pays royalties on a quarterly cycle. A quarter closes on the last day of March, June, September, and December. Statements are published in the author dashboard within 30 days of quarter-close, and bank transfers settle within 15 business days of statement publication. Authors are paid net-of-TDS for Indian accounts; international payouts settle in USD via the registered remittance partner.",
    keywords: [
      "royalty",
      "royalties",
      "payment",
      "payout",
      "paid",
      "unpaid",
      "delayed",
      "quarter",
      "quarterly",
      "cycle",
      "statement",
      "transfer",
      "settled",
      "tds",
    ],
    categoryAffinity: ["Royalty & Payments"],
  },
  {
    id: "royalty.statement-access",
    title: "How to access royalty statements",
    text:
      "Royalty statements are available under Dashboard → Earnings → Statements. Each row links to a downloadable PDF with per-channel breakdowns (Amazon, Flipkart, direct-print, distribution). If a statement is missing more than 30 days past quarter-close, the author should raise a ticket with the affected quarter and ISBN(s).",
    keywords: [
      "statement",
      "statements",
      "dashboard",
      "earnings",
      "pdf",
      "breakdown",
      "missing",
      "channel",
      "amazon",
      "flipkart",
    ],
    categoryAffinity: ["Royalty & Payments"],
  },
  {
    id: "royalty.bank-details",
    title: "Updating bank / payout details",
    text:
      "Authors can update bank account, UPI, or international remittance details from Settings → Payout. Any change made after a quarter has closed applies from the NEXT payout cycle — the closed quarter ships to whatever account was on file at quarter-close. KYC re-verification may be triggered for high-value changes.",
    keywords: [
      "bank",
      "upi",
      "account",
      "iban",
      "swift",
      "remittance",
      "payout",
      "settings",
      "kyc",
      "update",
      "change",
    ],
    categoryAffinity: ["Royalty & Payments"],
  },
];
