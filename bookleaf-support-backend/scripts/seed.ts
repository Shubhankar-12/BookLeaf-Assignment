import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { config } from "../src/config/env";
import { logger } from "../src/utils/logger";
import { DataBase } from "../src/db/connection";
import { userQueries, authorQueries, bookQueries } from "../src/db/queries";
import { hashPassword } from "../src/utils/password";
import { toObjectId } from "../src/utils/ids";
import type { BookStatus } from "../src/db/book";

interface DatasetBook {
  book_id: string;
  title: string;
  isbn: string;
  genre: string;
  publication_date: string | null;
  status: string;
  mrp: number | null;
  author_royalty_per_copy: number | null;
  total_copies_sold: number;
  total_royalty_earned: number;
  royalty_paid: number;
  royalty_pending: number;
  last_royalty_payout_date: string | null;
  print_partner: string | null;
  available_on: string[];
}

interface DatasetAuthor {
  author_id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joined_date: string;
  books: DatasetBook[];
}

interface Dataset {
  authors: DatasetAuthor[];
}

const ADMIN_EMAIL = "admin@bookleaf.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "BookLeaf Admin";

const AUTHOR_PASSWORD = "Author@123";

const DATASET_PATH = path.resolve(__dirname, "..", "bookleaf_sample_data.json");

// Fail loudly if dataset drifts from schema enum — don't silently coerce.
const ALLOWED_STATUSES: readonly BookStatus[] = [
  "Published & Live",
  "In Production - Cover Design",
  "In Production - Typesetting",
  "In Production - Editing",
  "In Production - Proofreading",
  "Out of Print",
];

const redactMongoUri = (uri: string): string =>
  uri.replace(/\/\/[^@]+@/, "//***@");

const toDateOrNull = (s: string | null): Date | null => {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

const assertStatus = (raw: string): BookStatus => {
  if ((ALLOWED_STATUSES as readonly string[]).includes(raw)) {
    return raw as BookStatus;
  }
  throw new Error(
    `Dataset book status "${raw}" is not in the allowed enum. ` +
      `Update BOOK_STATUSES in src/db/book/types.ts or fix the dataset.`,
  );
};

const loadDataset = (): Dataset => {
  if (!fs.existsSync(DATASET_PATH)) {
    throw new Error(`Dataset JSON not found at ${DATASET_PATH}`);
  }
  const raw = fs.readFileSync(DATASET_PATH, "utf-8");
  const parsed = JSON.parse(raw) as Dataset;
  if (!Array.isArray(parsed.authors) || parsed.authors.length === 0) {
    throw new Error("Dataset JSON has no authors[] array.");
  }
  return parsed;
};

const waitForMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;
  await new Promise<void>((resolve, reject) => {
    const onOpen = (): void => {
      cleanup();
      resolve();
    };
    const onError = (err: Error): void => {
      cleanup();
      reject(err);
    };
    const cleanup = (): void => {
      mongoose.connection.off("open", onOpen);
      mongoose.connection.off("error", onError);
    };
    mongoose.connection.once("open", onOpen);
    mongoose.connection.once("error", onError);
  });
};

const run = async (): Promise<void> => {
  logger.info(
    { mongo: redactMongoUri(config.MONGO_URI), dataset: DATASET_PATH },
    "Seed starting",
  );

  DataBase.getDatabaseConnection();
  await waitForMongo();

  const dataset = loadDataset();

  const adminHash = await hashPassword(ADMIN_PASSWORD);
  const admin = await userQueries.upsertUserByEmail(ADMIN_EMAIL, {
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    role: "ADMIN",
    password: adminHash,
  });
  logger.info(
    { email: admin.email, id: admin._id.toString() },
    "Admin upserted",
  );

  const authorPasswordHash = await hashPassword(AUTHOR_PASSWORD);

  let authorCount = 0;
  let bookCount = 0;

  for (const a of dataset.authors) {
    const user = await userQueries.upsertUserByEmail(a.email, {
      email: a.email,
      name: a.name,
      role: "AUTHOR",
      password: authorPasswordHash,
    });
    authorCount += 1;

    await authorQueries.upsertByUserId(user._id.toString(), {
      author_id: a.author_id,
      phone: a.phone ?? null,
      city: a.city ?? null,
      joined_date: toDateOrNull(a.joined_date),
    });

    const authorObjectId = toObjectId(user._id.toString());
    if (!authorObjectId) {
      logger.warn({ email: a.email }, "Skipping books — invalid author id");
      continue;
    }

    for (const b of a.books) {
      await bookQueries.upsertByIsbn(b.isbn, {
        authorId: authorObjectId,
        book_id: b.book_id,
        title: b.title,
        isbn: b.isbn,
        genre: b.genre ?? null,
        publication_date: toDateOrNull(b.publication_date),
        status: assertStatus(b.status),
        mrp: b.mrp,
        author_royalty_per_copy: b.author_royalty_per_copy,
        total_copies_sold: b.total_copies_sold,
        total_royalty_earned: b.total_royalty_earned,
        royalty_paid: b.royalty_paid,
        royalty_pending: b.royalty_pending,
        last_royalty_payout_date: toDateOrNull(b.last_royalty_payout_date),
        print_partner: b.print_partner ?? null,
        available_on: b.available_on ?? [],
        currency: "INR",
      });
      bookCount += 1;
    }

    logger.info(
      {
        authorId: a.author_id,
        email: a.email,
        books: a.books.length,
      },
      "Author + books upserted",
    );
  }

  logger.info(
    { admins: 1, authors: authorCount, books: bookCount },
    "Seed complete",
  );
};

run()
  .then(async () => {
    await DataBase.disconnect();
    process.exit(0);
  })
  .catch(async (err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ err: message }, "Seed failed");
    await DataBase.disconnect().catch(() => undefined);
    process.exit(1);
  });
