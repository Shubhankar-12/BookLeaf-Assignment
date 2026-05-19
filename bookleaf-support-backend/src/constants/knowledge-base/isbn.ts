import type { KBChunk } from "./index";

export const ISBN_KB: KBChunk[] = [
  {
    id: "isbn.allocation",
    title: "ISBN allocation",
    text:
      "Every BookLeaf print title is assigned a unique 13-digit ISBN by our registered agency. Allocation happens after the manuscript clears production review and typically completes within 5 working days. Authors who request a print + eBook bundle receive separate ISBNs for each format — the eBook ISBN is allocated only after the print ISBN is confirmed.",
    keywords: [
      "isbn",
      "allocation",
      "allocate",
      "assigned",
      "issue",
      "issued",
      "agency",
      "ebook",
      "print",
      "format",
      "bundle",
    ],
    categoryAffinity: ["ISBN & Metadata Issues"],
  },
  {
    id: "isbn.metadata-edits",
    title: "Editing book metadata after ISBN issue",
    text:
      "Title, author name, subtitle, and category are LOCKED once an ISBN is registered with the national agency. Cover image, blurb, keywords, and BISAC subjects can still be edited from the book dashboard and propagate to retailers within 48-72 hours. Any locked-field change requires a fresh ISBN — please raise a ticket with the proposed change and reason.",
    keywords: [
      "metadata",
      "edit",
      "change",
      "title",
      "author",
      "subtitle",
      "cover",
      "blurb",
      "keywords",
      "bisac",
      "locked",
      "category",
    ],
    categoryAffinity: ["ISBN & Metadata Issues"],
  },
  {
    id: "isbn.lookup",
    title: "Where to find your ISBN",
    text:
      "Issued ISBNs appear under Dashboard → Books → [Book Title] → Metadata, next to the format (Paperback / Hardcover / eBook). If the field reads 'Pending' more than 7 working days after production review approval, the author should raise a ticket including the book ID.",
    keywords: [
      "find",
      "lookup",
      "where",
      "isbn",
      "pending",
      "dashboard",
      "metadata",
      "paperback",
      "hardcover",
      "ebook",
    ],
    categoryAffinity: ["ISBN & Metadata Issues"],
  },
];
