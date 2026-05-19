import type { KBChunk } from "./index";

export const DISTRIBUTION_KB: KBChunk[] = [
  {
    id: "distribution.retail-onboarding",
    title: "Amazon / Flipkart listing timeline",
    text:
      "Print titles are pushed to Amazon India and Flipkart within 7 working days of ISBN registration. The retailer takes a further 3-5 working days to mint the product page and stock the warehouse. eBook editions on Kindle and Google Play Books typically go live within 48-72 hours of upload. Listings can be searched on the retailer using the ISBN; if the listing remains absent past these windows, please raise a ticket with the affected ISBN.",
    keywords: [
      "amazon",
      "flipkart",
      "kindle",
      "google",
      "listing",
      "listed",
      "live",
      "available",
      "availability",
      "distribution",
      "retail",
      "search",
    ],
    categoryAffinity: ["Distribution & Availability"],
  },
  {
    id: "distribution.stockouts",
    title: "Out-of-stock on retailers",
    text:
      "Print-on-demand stockouts can occur when retailer warehouses cycle inventory or a manual restock is pending. BookLeaf triggers a restock automatically when the on-hand quantity at a retailer falls below threshold. Authors who see 'Currently unavailable' or 'Out of stock' for more than 5 days should raise a ticket with the ISBN and the marketplace URL.",
    keywords: [
      "stock",
      "stockout",
      "out of stock",
      "unavailable",
      "restock",
      "inventory",
      "warehouse",
      "amazon",
      "flipkart",
    ],
    categoryAffinity: ["Distribution & Availability"],
  },
  {
    id: "distribution.international",
    title: "International availability",
    text:
      "BookLeaf prints in India. International readers buying from Amazon.com, Amazon.co.uk, or other non-India marketplaces are served via expanded distribution and shipping windows are 10-21 business days. Some titles may not be enabled for global retail; expanded distribution can be toggled from Dashboard → Books → [Title] → Distribution.",
    keywords: [
      "international",
      "global",
      "abroad",
      "us",
      "uk",
      "amazon.com",
      "shipping",
      "expanded",
      "distribution",
      "overseas",
    ],
    categoryAffinity: ["Distribution & Availability"],
  },
];
