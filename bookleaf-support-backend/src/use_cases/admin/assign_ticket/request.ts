// `assigneeId: null` un-assigns the ticket; the body key itself is required.
export interface AssignTicketRequest {
  params: { id: string };
  body: { assigneeId: string | null };
}
