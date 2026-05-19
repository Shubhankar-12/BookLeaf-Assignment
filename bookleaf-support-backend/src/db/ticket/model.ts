import { model, Model } from "mongoose";
import { ITicketDocument } from "./types";
import { ticketSchema } from "./schema";

export const TicketModel: Model<ITicketDocument> = model<ITicketDocument>(
  "Ticket",
  ticketSchema,
);
